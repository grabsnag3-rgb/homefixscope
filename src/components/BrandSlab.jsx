import "./brand-slab.css";

export default function BrandSlab() {
  return (
    <div className="brand-slab">
      <div className="brand-slab__inner">
        <div className="brand-slab__mark-well" aria-hidden="true">
          <img
            src="/lossscope-mark.png"
            alt=""
            className="brand-slab__mark-image"
          />
        </div>

        <div className="brand-slab__copy">
          <div className="brand-slab__title">LossScope</div>
          <p className="brand-slab__tag">
            Guided answers for high-friction insurance questions.
          </p>
        </div>
      </div>
    </div>
  );
}