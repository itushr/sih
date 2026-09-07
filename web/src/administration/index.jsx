import { useParams } from "react-router-dom";
import AdministrationLayout from "./layout/AdministrationLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import { EndpointDetailPage, RegisterEndpointPage, RegistryPage } from "./pages/RegistryPages.jsx";
import { PoliciesPage, PolicyCreatePage } from "./pages/PolicyPages.jsx";
import { EventCreatePage, EventDetailPage, EventsPage, LogDetailPage, LogsPage, OrchestrationCreatePage, OrchestrationsPage, SubscriptionCreatePage, SubscriptionDetailPage, SubscriptionsPage } from "./pages/OperationsPages.jsx";

const pageComponents = {
  overview: DashboardPage,
  registry: RegistryPage,
  register: RegisterEndpointPage,
  policies: PoliciesPage,
  "policy-create": PolicyCreatePage,
  logs: LogsPage,
  "log-detail": LogDetailPage,
  events: EventsPage,
  "event-create": EventCreatePage,
  "event-detail": EventDetailPage,
  "event-edit": EventDetailPage,
  subscriptions: SubscriptionsPage,
  "subscription-create": SubscriptionCreatePage,
  "subscription-detail": SubscriptionDetailPage,
  orchestrations: OrchestrationsPage,
  "orchestration-create": OrchestrationCreatePage,
};

function NotFound({ page }) {
  return (
    <section style={{ padding: "40px", textAlign: "center", color: "#637c6c" }}>
      <strong style={{ display: "block", fontSize: "20px", marginBottom: "8px" }}>Page not found</strong>
      <span style={{ fontSize: "13px" }}>No module registered for key: <code>{page}</code></span>
    </section>
  );
}

export default function Administration({ page = "overview" }) {
  const { endpointId } = useParams();
  const Page = pageComponents[page];
  const detailPage = page === "registry-detail" || page === "registry-edit";
  let content;
  if (detailPage) {
    content = <EndpointDetailPage endpointId={endpointId} editing={page === "registry-edit"} />;
  } else if (Page) {
    content = <Page page={page} />;
  } else {
    content = <NotFound page={page} />;
  }
  return <AdministrationLayout page={page}>{content}</AdministrationLayout>;
}
