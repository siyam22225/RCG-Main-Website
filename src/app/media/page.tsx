import Card from "@/components/ui/Card";
import { newsItems } from "@/data/news";

export default function MediaPage() {
  return (
    <section
      style={{
        background: "#f2f2f2",
        padding: "70px 0 90px",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "40px",
          }}
        >
          <h1
            style={{
              margin: 0,
              color: "#666",
              fontSize: "54px",
              fontWeight: 300,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            All News
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((item) => (
            <Card key={item.id} item={item} clampDescription={false} />
          ))}
        </div>
      </div>
    </section>
  );
}