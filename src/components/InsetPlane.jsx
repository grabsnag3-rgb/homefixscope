export default function InsetPlane({ children, className = "" }) {
  return (
    <section
      className={className}
      style={{
        position: "relative",
        borderRadius: "var(--radius-md)",
        background:
          "linear-gradient(180deg, rgba(255,248,236,0.042), rgba(255,248,236,0.028))",
        boxShadow: "var(--shadow-plane)",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(142,128,92,0.045), transparent 42%, rgba(255,248,236,0.01) 100%)",
          pointerEvents: "none",
        }}
      />
      {children}
    </section>
  );
}