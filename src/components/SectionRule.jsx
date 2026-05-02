export default function SectionRule({ label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "18px",
      }}
    >
      {label ? <p className="eyebrow">{label}</p> : null}
      <div
        style={{
          height: "1px",
          flex: 1,
          background: "var(--line-soft)",
        }}
      />
    </div>
  );
}