type SliderDotsProps = {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
};

export default function SliderDots({ count, activeIndex, onSelect }: SliderDotsProps) {
  return (
    <div className="slider-dots" aria-label="Slide navigation">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          type="button"
          className={`slider-dot ${index === activeIndex ? "active" : ""}`}
          aria-label={`Go to slide ${index + 1}`}
          onClick={() => onSelect(index)}
        />
      ))}
    </div>
  );
}
