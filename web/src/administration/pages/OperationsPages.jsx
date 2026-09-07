import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { logs, events, subscriptions, workflows } from "../data/mockData.js";
import { PageIntro, PanelHead, Status, TableShell } from "../components/AdminShared.jsx";
import { rules } from "../../shared/validation/rules.js";
import { useFormValidation } from "../../shared/validation/useFormValidation.js";
import { FormField, ErrorBanner } from "../../shared/components/FormField.jsx";
import { useConfirm } from "../../shared/dialog/ConfirmDialogContext.jsx";

export function LogsPage() {
	const navigate = useNavigate();
	const [query, setQuery] = useState("");
	const [level, setLevel] = useState("ALL");
	const [state, setState] = useState("ALL");
	const filteredLogs = logs.filter(([, logLevel, service, message, logState]) => `${service} ${message}`.toLowerCase().includes(query.toLowerCase()) && (level === "ALL" || logLevel === level) && (state === "ALL" || logState.toUpperCase() === state));
	return <><PageIntro eyebrow="F4 / Operational signals" title="Errors & Logs" description="Trace service health, delivery events, and unresolved incidents." action="Export logs" /><section className="log-summary"><div><strong>3</strong><span>open incidents</span></div><div><strong>98.7%</strong><span>resolved within target</span></div><div><strong>24h</strong><span>retention window</span></div></section><div className="log-filters"><label>Search logs<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Service or message" /></label><label>Severity<select value={level} onChange={(event) => setLevel(event.target.value)}><option value="ALL">All levels</option><option>ERROR</option><option>WARN</option><option>INFO</option></select></label><label>State<select value={state} onChange={(event) => setState(event.target.value)}><option value="ALL">All states</option><option value="OPEN">Open</option><option value="RESOLVED">Resolved</option></select></label></div><TableShell headers={["Time / severity", "Service", "Message", "State", ""]}>{filteredLogs.length ? filteredLogs.map(([time, logLevel, service, message, logState], index) => <div className="table-row" key={`${time}-${service}`}><div className="table-primary"><strong className={`log-level ${logLevel.toLowerCase()}`}>{logLevel}</strong><small>{time} · Today</small></div><span className="table-muted">{service}</span><span className="table-message">{message}</span><Status tone={logState === "Open" ? "coral" : "green"}>{logState}</Status><button className="row-arrow" type="button" aria-label={`Open ${message}`} onClick={() => navigate(`/administration/errors-logs/${index}`)}>→</button></div>) : <div className="registry-empty"><strong>No logs found</strong><span>Adjust the search or filters.</span></div>}</TableShell></>;
}

export function LogDetailPage() {
	const navigate = useNavigate();
	const { logId } = useParams();
	const [time, level, service, message, state] = logs[Number(logId)] || logs[0];
	const [resolved, setResolved] = useState(state === "Resolved");
	return <section className="log-detail-page"><div className="detail-heading"><button className="back-link" type="button" onClick={() => navigate("/administration/errors-logs")}>← Errors &amp; Logs</button><div className="detail-title-row"><span className={`log-level ${level.toLowerCase()}`}>{level}</span><div><span className="eyebrow">Incident / {service}</span><h2>{message}</h2></div><Status tone={resolved ? "green" : "coral"}>{resolved ? "Resolved" : state}</Status></div><p>Review the event context, affected service, and resolution history before closing this incident.</p></div><div className="log-detail-grid"><section className="detail-panel"><PanelHead eyebrow="Incident context" title="What happened" /><div className="detail-list"><div><span>Detected</span><strong>{time} · 07 September 2026</strong></div><div><span>Affected service</span><strong>{service}</strong></div><div><span>Severity</span><strong className={`log-level ${level.toLowerCase()}`}>{level}</strong></div><div><span>Message</span><strong>{message}</strong></div></div></section><section className="detail-panel"><PanelHead eyebrow="Resolution" title={resolved ? "Incident resolved" : "Needs attention"} /><p className="log-resolution-copy">{resolved ? "This incident was acknowledged and marked resolved by the operations team." : "No resolution has been recorded yet. Confirm the service is healthy before closing the incident."}</p><button className={resolved ? "outline-button" : "solid-button compact"} type="button" onClick={() => setResolved((current) => !current)}>{resolved ? "Reopen incident" : "Mark as resolved"}</button></section></div><section className="log-payload"><PanelHead eyebrow="Raw event context" title="Diagnostic payload" /><pre>{JSON.stringify({ service, level, message, detectedAt: "2026-09-07T09:47:18Z", requestId: "req_demo_8f2a", state: resolved ? "RESOLVED" : "OPEN" }, null, 2)}</pre></section></section>;
}

export function EventsPage() { const navigate = useNavigate(); return <><PageIntro eyebrow="F5 / Platform vocabulary" title="Event Registry" description="Define the signals that move work between existing department systems." action="＋ Register event" onAction={() => navigate("/administration/event-registry/new")} /><div className="event-grid">{events.map(([slug, name, subscribers, status], index) => <article className="event-card" key={slug}><div className="event-mark">✣</div><Status>{status}</Status><h3>{name}</h3><code>{slug}</code><div className="event-card-footer"><span>{subscribers}</span><button className="text-button" type="button" onClick={() => navigate(`/administration/event-registry/${index}`)}>View schema →</button></div></article>)}</div></>; }

export function EventDetailPage({ page = "event-detail" }) {
	const navigate = useNavigate();
	const { eventId } = useParams();
	const index = Number(eventId) || 0;
	const [slug, defaultName, subscribers, status] = events[index] || events[0];
	const [name, setName] = useState(defaultName);
	const [description, setDescription] = useState("Published when a citizen submits an application for review.");
	const [saved, setSaved] = useState(false);
	const editing = page === "event-edit";
	const schema = [{ name: "application_id", type: "string", required: true }, { name: "department_id", type: "string", required: true }, { name: "submitted_at", type: "datetime", required: true }];
	return <section className="event-detail-page"><div className="detail-heading"><button className="back-link" type="button" onClick={() => navigate("/administration/event-registry")}>← Event Registry</button><div className="detail-title-row"><span className="event-mark">✣</span><div><span className="eyebrow">Registered event / Platform contract</span><h2>{editing ? "Edit event contract" : name}</h2></div><Status>{status}</Status></div><p>{editing ? "Update this contract carefully: subscribers depend on stable event names and payload fields." : description}</p></div><div className="event-detail-grid"><section className="detail-panel">{editing ? <><PanelHead eyebrow="Event identity" title="Edit metadata" /><div className="detail-form"><label>Event name<input value={name} onChange={(event) => setName(event.target.value)} /></label><label>Event slug<input defaultValue={slug} /></label><label>Description<textarea rows="4" value={description} onChange={(event) => setDescription(event.target.value)} /></label><button className="solid-button compact" type="button" onClick={() => setSaved(true)}>Save changes</button>{saved && <span className="save-confirmation">Changes saved locally.</span>}</div></> : <><PanelHead eyebrow="Event identity" title="Contract metadata" /><div className="detail-list"><div><span>Event name</span><strong>{name}</strong></div><div><span>Event slug</span><strong>{slug}</strong></div><div><span>Subscribers</span><strong>{subscribers}</strong></div><div><span>Last updated</span><strong>07 September 2026 · Admin network</strong></div></div></>}</section><section className="detail-panel"><PanelHead eyebrow="Payload schema" title="Fields" /><div className="schema-list">{schema.map((field) => <div className="schema-row" key={field.name}><div><strong>{field.name}</strong><small>{field.type}</small></div>{field.required && <Status>Required</Status>}</div>)}</div><div className="subscriber-summary"><strong>{subscribers}</strong><span>currently listening to this event</span></div></section></div><div className="detail-actions"><button className="outline-button" type="button" onClick={() => navigate(`/administration/event-registry/${index}/edit`)}>Edit event</button><button className="solid-button compact" type="button" onClick={() => navigate("/administration/subscriptions/new")}>Create subscription →</button></div></section>;
}

export function EventCreatePage() {
	const navigate = useNavigate();
	const [fields, setFields] = useState([
		{ name: "application_id", type: "string", required: true },
		{ name: "department_id", type: "string", required: true },
		{ name: "submitted_at", type: "datetime", required: true },
	]);
	const [schemaError, setSchemaError] = useState(null);
	const [saved, setSaved] = useState(false);

	const { getFieldProps, handleSubmit, errors, touched } = useFormValidation({
		initialValues: {
			name: "Application submitted",
			slug: "application.submitted",
			description: "Published when a citizen submits an application for review.",
		},
		validationRules: {
			name: [rules.required("Event name is required."), rules.minLength(3, "Event name must be at least 3 characters.")],
			slug: [rules.required("Event slug is required."), rules.validSlug("Slug must follow entity.action format (e.g. application.submitted).")],
			description: [rules.required("Description is required."), rules.minLength(10, "Description must be at least 10 characters.")],
		},
	});

	const updateField = (index, key, value) => {
		setFields((current) => current.map((field, fieldIndex) => fieldIndex === index ? { ...field, [key]: value } : field));
		setSchemaError(null);
	};
	const addField = () => setFields((current) => [...current, { name: "", type: "string", required: false }]);
	const removeField = (index) => setFields((current) => current.filter((_, fieldIndex) => fieldIndex !== index));

	const validateSchema = () => {
		if (fields.length === 0) {
			setSchemaError("At least one payload schema field is required.");
			return false;
		}
		const invalid = fields.find((f) => !f.name || f.name.trim() === "");
		if (invalid) {
			setSchemaError("All payload fields must have a valid field name.");
			return false;
		}
		return true;
	};

	const onRegister = handleSubmit(() => {
		if (!validateSchema()) return;
		navigate("/administration/event-registry");
	});

	const onSaveDraft = handleSubmit(() => {
		if (!validateSchema()) return;
		setSaved(true);
	});

	const preview = JSON.stringify(Object.fromEntries(fields.filter((field) => field.name).map((field) => [field.name, field.type === "number" ? 0 : field.type === "boolean" ? true : field.type === "datetime" ? "2026-09-07T09:42:00Z" : "example"])), null, 2);

	return <section className="event-editor-page"><div className="event-editor-heading"><button className="back-link" type="button" onClick={() => navigate("/administration/event-registry")}>← Event Registry</button><span className="module-number">F5</span><h2>Register New Event</h2><p>Define a stable event contract that departments and subscriptions can understand.</p></div>{schemaError && <div style={{ padding: "0 24px", paddingTop: 16 }}><ErrorBanner message={schemaError} /></div>}<form noValidate onSubmit={onRegister}><div className="event-editor-grid"><section className="event-editor-form"><div className="register-section-heading"><span>1. Event identity</span><small>Public contract metadata</small></div><div className="event-form-fields"><FormField label="Event name" htmlFor="name" required error={touched.name && errors.name}><input {...getFieldProps("name")} /></FormField><FormField label="Event slug" htmlFor="slug" required hint="e.g. application.submitted" error={touched.slug && errors.slug}><input {...getFieldProps("slug")} /></FormField><FormField label="Description" htmlFor="description" required error={touched.description && errors.description}><textarea rows="3" {...getFieldProps("description")} /></FormField></div><div className="register-section-heading event-fields-heading"><span>2. Payload schema</span><button className="outline-button compact-outline" type="button" onClick={addField}>＋ Add field</button></div>{fields.map((field, index) => <div className="event-field-row" key={`event-field-${index}`}><label>Field name<input value={field.name} onChange={(event) => updateField(index, "name", event.target.value)} /></label><label>Type<select value={field.type} onChange={(event) => updateField(index, "type", event.target.value)}><option>string</option><option>number</option><option>boolean</option><option>datetime</option></select></label><label className="required-check"><input checked={field.required} onChange={(event) => updateField(index, "required", event.target.checked)} type="checkbox" /> Required</label><button className="delete-field" type="button" aria-label={`Remove ${field.name || "field"}`} onClick={() => removeField(index)}>♧</button></div>)}</section><aside className="event-preview"><div className="register-section-heading"><span>3. Example payload</span><Status>JSON</Status></div><pre>{preview}</pre><div className="event-preview-note"><strong>{fields.filter((field) => field.required).length} required fields</strong><span>Subscribers will receive this contract.</span></div></aside></div><div className="register-footer"><span className={saved ? "save-confirmation" : ""}>{saved ? "Event saved locally" : "Schema changes remain in this workspace draft."}</span><div><button className="outline-button" type="button" onClick={onSaveDraft}>Save as Draft</button><button className="solid-button compact" type="submit">✓ Register event</button></div></div></form></section>;
}

export function SubscriptionsPage() { const navigate = useNavigate(); return <><PageIntro eyebrow="F6 / Delivery channels" title="Subscriptions" description="Monitor the webhook destinations receiving platform events." action="＋ New subscription" onAction={() => navigate("/administration/subscriptions/new")} /><section className="admin-panel delivery-panel"><PanelHead eyebrow="Delivery overview" title="All subscriptions" action="View deliveries →" /><TableShell headers={["Subscription", "Event", "Destination", "State", "Success"]}>{subscriptions.map(([name, event, destination, state, success], index) => <div className="table-row" key={name}><div className="table-primary"><strong>{name}</strong><small>Created by Admin network</small></div><code>{event}</code><span className="table-message">{destination}</span><Status tone={state === "PAUSED" ? "amber" : "green"}>{state}</Status><span className="table-muted">{success}</span><button className="row-arrow" type="button" aria-label={`Open ${name}`} onClick={() => navigate(`/administration/subscriptions/${index}`)}>→</button></div>)}</TableShell></section></>; }

export function SubscriptionDetailPage() {
	const navigate = useNavigate();
	const confirm = useConfirm();
	const { subscriptionId } = useParams();
	const [name, event, destination, initialState, success] = subscriptions[Number(subscriptionId) || 0] || subscriptions[0];
	const [paused, setPaused] = useState(initialState === "PAUSED");
	const [retried, setRetried] = useState(false);
	const deliveries = [["09:42:18", "DELIVERED", "200 OK", "application.submitted"], ["09:41:02", "DELIVERED", "200 OK", "application.submitted"], ["09:38:47", "FAILED", "504 Gateway Timeout", "application.submitted"], ["09:35:10", "DELIVERED", "200 OK", "application.submitted"]];

	const handleTogglePause = async () => {
		const action = paused ? "Resume" : "Pause";
		const ok = await confirm({
			title: `${action} Subscription Delivery?`,
			message: `Are you sure you want to ${action.toLowerCase()} deliveries for "${name}"?`,
			confirmText: `${action} Delivery`,
			tone: paused ? "standard" : "danger",
		});
		if (ok) {
			setPaused((current) => !current);
		}
	};

	return <section className="subscription-detail-page"><div className="detail-heading"><button className="back-link" type="button" onClick={() => navigate("/administration/subscriptions")}>← Subscriptions</button><div className="detail-title-row"><span className="workflow-icon">↗</span><div><span className="eyebrow">Delivery channel / {event}</span><h2>{name}</h2></div><Status tone={paused ? "amber" : "green"}>{paused ? "PAUSED" : "DELIVERING"}</Status></div><p>Monitor this subscription's destination, filters, and delivery history.</p></div><div className="subscription-detail-grid"><section className="detail-panel"><PanelHead eyebrow="Subscription configuration" title="Delivery details" /><div className="detail-list"><div><span>Event contract</span><strong>{event}</strong></div><div><span>Destination</span><strong>{destination}</strong></div><div><span>Delivery success</span><strong>{success}</strong></div><div><span>Filters</span><strong>department_id · application_id</strong></div></div><div className="subscription-detail-actions"><button className="outline-button" type="button" onClick={() => navigate("/administration/subscriptions/new")}>Edit subscription</button><button className={paused ? "solid-button compact" : "outline-button"} type="button" onClick={handleTogglePause}>{paused ? "Resume delivery" : "Pause delivery"}</button></div></section><section className="detail-panel"><PanelHead eyebrow="Delivery health" title="Recent attempts" /><div className="delivery-health-score"><strong>{success}</strong><span>successful deliveries</span></div><div className="delivery-bars"><i /><i /><i className="failed" /><i /><i /><i /></div><span className="table-muted">Last delivery 18 seconds ago</span></section></div><section className="delivery-history"><PanelHead eyebrow="Delivery history" title="Latest attempts" action="Export history ↓" /><div className="delivery-history-list">{deliveries.map(([time, deliveryState, response, deliveryEvent]) => <div className="delivery-history-row" key={`${time}-${response}`}><time>{time}</time><span className={`delivery-status ${deliveryState.toLowerCase()}`}>{deliveryState}</span><div><strong>{deliveryEvent}</strong><small>{deliveryEvent}</small></div>{deliveryState === "FAILED" && <button className="text-button" type="button" onClick={() => setRetried(true)}>Retry</button>}</div>)}</div>{retried && <div className="retry-confirmation">Retry queued locally for the failed delivery.</div>}</section></section>;
}

export function SubscriptionCreatePage() {
	const navigate = useNavigate();
	const [filters, setFilters] = useState(["department_id", "application_id"]);
	const [saved, setSaved] = useState(false);

	const { values, getFieldProps, handleSubmit, errors, touched } = useFormValidation({
		initialValues: {
			name: "Citizen services audit stream",
			event: "application.submitted",
			destination: "https://audit.gov.in/events",
			delivery: "Webhook",
			secret: "sk_live_demo_12345678",
		},
		validationRules: {
			name: [rules.required("Subscription name is required."), rules.minLength(3, "Name must be at least 3 characters.")],
			event: [rules.required("Event type is required.")],
			delivery: [rules.required("Delivery mode is required.")],
			destination: [rules.required("Destination URL is required."), rules.validUrl("Destination must be a valid HTTP or HTTPS URL.")],
			secret: [rules.required("Signing secret is required."), rules.minLength(8, "Secret must be at least 8 characters.")],
		},
	});

	const toggleFilter = (filter) => setFilters((current) => current.includes(filter) ? current.filter((item) => item !== filter) : [...current, filter]);

	const onSave = handleSubmit(() => {
		navigate("/administration/subscriptions");
	});

	const onSaveDraft = handleSubmit(() => {
		setSaved(true);
	});

	return <section className="subscription-editor-page"><div className="subscription-editor-heading"><button className="back-link" type="button" onClick={() => navigate("/administration/subscriptions")}>← Subscriptions</button><span className="module-number">F6</span><h2>Create Subscription</h2><p>Choose the event contract and delivery destination that should receive updates.</p></div><form noValidate onSubmit={onSave}><div className="subscription-editor-grid"><section className="subscription-form"><div className="register-section-heading"><span>1. Delivery definition</span><small>Required details</small></div><div className="subscription-fields"><FormField label="Subscription name" htmlFor="name" required error={touched.name && errors.name}><input {...getFieldProps("name")} /></FormField><FormField label="Event type" htmlFor="event" required error={touched.event && errors.event}><select {...getFieldProps("event")}><option>application.submitted</option><option>consent.granted</option><option>service.fetch.completed</option><option>policy.violation</option></select></FormField><FormField label="Delivery mode" htmlFor="delivery" required error={touched.delivery && errors.delivery}><select {...getFieldProps("delivery")}><option>Webhook</option><option>Server-sent events</option></select></FormField><FormField label="Destination URL" htmlFor="destination" required error={touched.destination && errors.destination}><input {...getFieldProps("destination")} /></FormField></div><div className="register-section-heading subscription-filter-heading"><span>2. Optional filters</span><small>Only matching events are delivered</small></div><div className="subscription-filter-options">{["department_id", "application_id", "citizen_id", "status"].map((filter) => <label className={filters.includes(filter) ? "selected" : ""} key={filter}><input checked={filters.includes(filter)} onChange={() => toggleFilter(filter)} type="checkbox" />{filter}</label>)}</div><FormField label="Signing secret" htmlFor="secret" required error={touched.secret && errors.secret} className="secret-field"><input {...getFieldProps("secret")} /></FormField></section><aside className="subscription-preview"><div className="register-section-heading"><span>3. Delivery preview</span><Status>READY</Status></div><div className="delivery-preview-card"><span className="workflow-icon">↗</span><strong>{values.event}</strong><small>{values.destination}</small><div><span>{values.delivery}</span><span>{filters.length} filters</span></div></div><div className="subscription-checklist"><strong>Before activating</strong><span>✓ Destination responds to verification</span><span>✓ Signing secret is configured</span><span>✓ Event contract is registered</span></div></aside></div><div className="register-footer"><span className={saved ? "save-confirmation" : ""}>{saved ? "Subscription saved locally" : "Changes remain in this workspace draft."}</span><div><button className="outline-button" type="button" onClick={onSaveDraft}>Save as Draft</button><button className="solid-button compact" type="submit">✓ Create subscription</button></div></div></form></section>;
}

export function OrchestrationsPage() { const navigate = useNavigate(); return <><PageIntro eyebrow="F7 / Workflow control room" title="Orchestrations" description="Coordinate multi-department work without replacing the systems of record." action="＋ New workflow" onAction={() => navigate("/administration/orchestrations/new")} /><div className="workflow-grid">{workflows.map(([name, trigger, steps, state, runs]) => <article className="workflow-card" key={name}><div className="workflow-card-top"><span className="workflow-icon">↗</span><Status tone={state === "PAUSED" ? "amber" : "green"}>{state}</Status></div><h3>{name}</h3><p>{trigger} trigger · {steps}</p><div className="workflow-footer"><span>{runs}</span><button className="text-button" type="button">Open workflow →</button></div></article>)}</div><section className="admin-panel orchestration-note"><span className="eyebrow">Run monitor</span><h2>Nothing needs your attention.</h2><p>Successful workflow runs and paused steps will appear here as they move through the network.</p></section></>; }

export function OrchestrationCreatePage() {
	const navigate = useNavigate();
	const confirm = useConfirm();
	const [steps, setSteps] = useState([{ type: "HTTP", name: "Verify application", detail: "Housing Support Gateway" }, { type: "CONSENT", name: "Request consent", detail: "Income and residency records" }, { type: "NOTIFY", name: "Notify case officer", detail: "Central authority inbox" }]);
	const [stepError, setStepError] = useState(null);
	const [saved, setSaved] = useState(false);

	const { values, getFieldProps, handleSubmit, errors, touched } = useFormValidation({
		initialValues: {
			name: "New housing application",
			trigger: "EVENT",
			event: "application.submitted",
			description: "Coordinate review steps after a citizen submits a housing application.",
		},
		validationRules: {
			name: [rules.required("Workflow name is required."), rules.minLength(3, "Name must be at least 3 characters.")],
			trigger: [rules.required("Trigger type is required.")],
			event: [rules.required("Trigger event is required.")],
			description: [rules.required("Description is required."), rules.minLength(10, "Description must be at least 10 characters.")],
		},
	});

	const updateStep = (index, key, value) => {
		setSteps((current) => current.map((step, stepIndex) => stepIndex === index ? { ...step, [key]: value } : step));
		setStepError(null);
	};
	const addStep = () => setSteps((current) => [...current, { type: "HTTP", name: "New workflow step", detail: "Choose a connected service" }]);

	const removeStep = async (index) => {
		const step = steps[index];
		const stepName = step?.name || `Step #${index + 1}`;
		const ok = await confirm({
			title: "Remove Workflow Step?",
			message: `Are you sure you want to remove "${stepName}" from this orchestration?`,
			confirmText: "Remove step",
			tone: "danger",
		});
		if (!ok) return;
		setSteps((current) => current.filter((_, stepIndex) => stepIndex !== index));
	};

	const validateSteps = () => {
		if (steps.length === 0) {
			setStepError("At least one workflow step is required.");
			return false;
		}
		const invalid = steps.find((s) => !s.name.trim() || !s.detail.trim());
		if (invalid) {
			setStepError("All steps must have a step name and a target service detail.");
			return false;
		}
		return true;
	};

	const onSave = handleSubmit(() => {
		if (!validateSteps()) return;
		navigate("/administration/orchestrations");
	});

	const onSaveDraft = handleSubmit(() => {
		if (!validateSteps()) return;
		setSaved(true);
	});

	return <section className="workflow-editor-page"><div className="workflow-editor-heading"><button className="back-link" type="button" onClick={() => navigate("/administration/orchestrations")}>← Orchestrations</button><span className="module-number">F7</span><h2>Create Workflow</h2><p>Turn a cross-department sequence into a visible, reviewable operational flow.</p></div>{stepError && <div style={{ padding: "0 24px", paddingTop: 16 }}><ErrorBanner message={stepError} /></div>}<form noValidate onSubmit={onSave}><div className="workflow-editor-grid"><section className="workflow-form"><div className="register-section-heading"><span>1. Workflow definition</span><small>Trigger and purpose</small></div><div className="workflow-fields"><FormField label="Workflow name" htmlFor="name" required error={touched.name && errors.name}><input {...getFieldProps("name")} /></FormField><FormField label="Trigger type" htmlFor="trigger" required error={touched.trigger && errors.trigger}><select {...getFieldProps("trigger")}><option>EVENT</option><option>MANUAL</option><option>SCHEDULE</option><option>API</option></select></FormField><FormField label="Trigger event" htmlFor="event" required error={touched.event && errors.event}><select {...getFieldProps("event")}><option>application.submitted</option><option>consent.granted</option><option>service.fetch.completed</option></select></FormField><FormField label="Description" htmlFor="description" required error={touched.description && errors.description}><textarea rows="3" {...getFieldProps("description")} /></FormField></div><div className="register-section-heading workflow-steps-heading"><span>2. Workflow steps</span><button className="outline-button compact-outline" type="button" onClick={addStep}>＋ Add step</button></div>{steps.map((step, index) => <div className="workflow-step-row" key={`workflow-step-${index}`}><span className="workflow-step-number">{String(index + 1).padStart(2, "0")}</span><label>Step name<input value={step.name} onChange={(event) => updateStep(index, "name", event.target.value)} /></label><label>Action<select value={step.type} onChange={(event) => updateStep(index, "type", event.target.value)}><option>HTTP</option><option>CONSENT</option><option>NOTIFY</option></select></label><label>Target<input value={step.detail} onChange={(event) => updateStep(index, "detail", event.target.value)} /></label><button className="delete-field" type="button" aria-label={`Remove step ${index + 1}`} onClick={() => removeStep(index)}>♧</button></div>)}</section><aside className="workflow-preview"><div className="register-section-heading"><span>3. Run preview</span><Status>READY</Status></div><div className="workflow-flow"><div className="flow-trigger">{values.event}</div>{steps.map((step, index) => <div className="flow-step" key={`preview-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{step.name}</strong><small>{step.type} · {step.detail}</small></div></div>)}</div><div className="workflow-preview-note"><strong>{steps.length} steps</strong><span>Runs in order after the trigger is received.</span></div></aside></div><div className="register-footer"><span className={saved ? "save-confirmation" : ""}>{saved ? "Workflow saved locally" : "Workflow remains a local draft."}</span><div><button className="outline-button" type="button" onClick={onSaveDraft}>Save as Draft</button><button className="solid-button compact" type="submit">✓ Create workflow</button></div></div></form></section>;
}
