export default function DomainArt({ motif = "organic-storm", className = "" }) {
  return (
    <div className={`domain-art domain-art--${motif} ${className}`} aria-hidden="true">
      <div className="domain-art__halo" />
      <div className="domain-art__axis domain-art__axis--x" />
      <div className="domain-art__axis domain-art__axis--y" />

      {motif === "organic-storm" ? (
        <div className="domain-art__organic">
          <span className="domain-art__organic-line domain-art__organic-line--1" />
          <span className="domain-art__organic-line domain-art__organic-line--2" />
          <span className="domain-art__organic-line domain-art__organic-line--3" />
        </div>
      ) : null}

      {motif === "directional-route" ? (
        <div className="domain-art__route">
          <span className="domain-art__route-line domain-art__route-line--1" />
          <span className="domain-art__route-line domain-art__route-line--2" />
          <span className="domain-art__route-dot" />
        </div>
      ) : null}

      {motif === "orbit-thread" ? (
        <div className="domain-art__orbit">
          <span className="domain-art__orbit-ring domain-art__orbit-ring--1" />
          <span className="domain-art__orbit-ring domain-art__orbit-ring--2" />
          <span className="domain-art__orbit-core" />
        </div>
      ) : null}
    </div>
  );
}