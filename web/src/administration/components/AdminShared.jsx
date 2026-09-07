export function PanelHead({ eyebrow, title, action }) {
  return <div className="panel-head"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{action && <button className="text-button" type="button">{action}</button>}</div>;
}

export function PageIntro({ eyebrow, title, description, action = "＋ Add new", onAction }) {
  return <section className="module-intro"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2><p>{description}</p></div><button className="solid-button compact" type="button" onClick={onAction}>{action}</button></section>;
}

export function Status({ children, tone = "green" }) {
  return <span className={`status-tag ${tone}`}>{children}</span>;
}

export function TableShell({ children, headers }) {
  return <div className="admin-table"><div className="table-row table-header">{headers.map((header) => <span key={header}>{header}</span>)}</div>{children}</div>;
}
