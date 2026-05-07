export function AppShell({ children, className = '', blobs = false }) {
  return (
    <div className={`page ${className}`.trim()}>
      {blobs && (
        <>
          <div className="page-blob page-blob--warm" aria-hidden="true" />
          <div className="page-blob page-blob--sage" aria-hidden="true" />
        </>
      )}
      {children}
    </div>
  );
}

export function Topbar({ left, right, className = '' }) {
  return <div className={`topbar ${className}`.trim()}><div>{left}</div><div>{right}</div></div>;
}

export function SectionHeader({ title, subtitle, level = 'h2', titleClassName = 'display display--h2', className = '' }) {
  const Tag = level;
  return (
    <div className={`section-header ${className}`.trim()}>
      <Tag className={titleClassName}>{title}</Tag>
      {subtitle ? <p className="body-md section-header__subtitle">{subtitle}</p> : null}
    </div>
  );
}

export function Card({ tone = 'warm', className = '', children }) {
  const isBase = ['warm', 'canvas-mid', 'tinted', 'elevated'].includes(tone);
  return <div className={`${isBase ? 'card' : ''} card--${tone} ${className}`.trim()}>{children}</div>;
}

export function Pill({ variant = 'live', dot = false, children, className = '' }) {
  return (
    <div className={`pill pill--${variant} ${className}`.trim()}>
      {dot ? <div className={`pill--${variant}__dot`} /> : null}
      <span className={`pill--${variant}__text`}>{children}</span>
    </div>
  );
}

export function TagCluster({ items, tone = 'sage', className = '' }) {
  return <div className={`tag-cluster ${className}`.trim()}>{items.map((t) => <span key={t} className={`tag tag--${tone}`}>{t}</span>)}</div>;
}

export function Avatar({ initials, size = 'md', className = '' }) {
  return <div className={`avatar avatar--${size} ${className}`.trim()}>{initials}</div>;
}

export function EmptyState({ icon = '✦', title, description, className = '' }) {
  return (
    <div className={`empty-state ${className}`.trim()}>
      <div className="empty-state__icon">{icon}</div>
      <h2 className="display display--h4 empty-state__title">{title}</h2>
      {description ? <p className="empty-state__description">{description}</p> : null}
    </div>
  );
}
