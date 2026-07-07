export default function MessagePage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title">Message</h1>
          <p className="page-description">
            Use this page for chairman, managing director, or leadership messages.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2">
          <div className="card">
            <div className="media-thumb">Leadership Photo</div>
          </div>
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">A simple leadership message layout</h2>
              <p className="card-text">
                Keep the photo on one side and the message on the other. This looks corporate and remains easy to edit.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
