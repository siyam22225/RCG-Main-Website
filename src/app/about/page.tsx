import SectionTitle from "@/components/ui/SectionTitle";

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title">About Us</h1>
          <p className="page-description">
            This page explains the company story, vision, mission, and core values.
            Keep this page simple, trustworthy, and easy to scan.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2">
          <div>
            <SectionTitle
              eyebrow="Our Story"
              title="Build trust first, then explain the company"
              description="Use this section for a short and clear company introduction."
              center={false}
            />
            <p className="muted">
              You can later replace this text with your real company history. The goal is to keep the page
              clean and professional instead of using too much long corporate writing.
            </p>
          </div>
          <div className="card">
            <div className="media-thumb">Company Image / Video</div>
            <div className="card-body">
              <h3 className="card-title">Why this structure works</h3>
              <p className="card-text">
                It keeps content separate from layout, so future edits stay simple.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
