export default function DecisionBridge() {
  return (
    <section
      aria-hidden="true"
      style={{
        position: "relative",
        height: "44px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "220px",
          height: "26px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,244,220,0.02) 14%, rgba(255,244,220,0.10) 50%, rgba(255,244,220,0.02) 86%, transparent 100%)",
          filter: "blur(12px)",
          opacity: 0.95,
        }}
      />

      <div
        style={{
          position: "relative",
          width: "168px",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,243,220,0.03) 18%, rgba(255,243,220,0.16) 50%, rgba(255,243,220,0.03) 82%, transparent 100%)",
        }}
      />
    </section>
  );
}