"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ContactMap from "@/sections/home/ContactMap";

type FormState = {
  name: string;
  email: string;
  phone: string;
  queryType: string;
  subject: string;
  message: string;
};

function buildPropertyMessage(propertyName: string) {
  return `Hello, I would like to know more about ${propertyName}. Please share pricing, availability, brochure, and visit details.`;
}

export default function ContactPage() {
  return (
    <Suspense fallback={null}>
      <ContactPageContent />
    </Suspense>
  );
}

function ContactPageContent() {
  const searchParams = useSearchParams();
  const selectedProperty = searchParams.get("property") ?? "";

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    queryType: "General Inquiry",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!selectedProperty) return;

    setForm((prev) => ({
      ...prev,
      queryType: "Property Enquiry",
      subject: prev.subject || `Enquiry about ${selectedProperty}`,
      message: prev.message || buildPropertyMessage(selectedProperty),
    }));
  }, [selectedProperty]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to send message");
      }

      setSuccessMessage("Your message has been sent successfully.");
      setForm({
        name: "",
        email: "",
        phone: "",
        queryType: selectedProperty ? "Property Enquiry" : "General Inquiry",
        subject: selectedProperty ? `Enquiry about ${selectedProperty}` : "",
        message: selectedProperty ? buildPropertyMessage(selectedProperty) : "",
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-page"><style jsx>{`
        .contact-page {
          padding: 54px 20px 76px;
          background: transparent;
        }

        .contact-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .contact-heading {
          text-align: center;
          margin-bottom: 32px;
        }

        .contact-badge {
          margin: 0 0 10px;
          color: #16a34a;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .contact-heading h1 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(34px, 5vw, 56px);
          font-weight: 900;
          letter-spacing: -0.04em;
        }

        .contact-heading p {
          max-width: 720px;
          margin: 14px auto 0;
          color: #475569;
          font-size: 16px;
          line-height: 1.75;
          font-weight: 600;
        }

        .selected-property {
          max-width: 720px;
          margin: 18px auto 0;
          background: #fff7ed;
          color: #9a3412;
          border: 1px solid #fdba74;
          padding: 12px 16px;
          border-radius: 14px;
          font-weight: 800;
        }

        .message-card {
          width: 100%;
          background: rgba(255, 255, 255, 0.98);
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 26px 70px rgba(15, 23, 42, 0.14);
          border: 1px solid rgba(37, 99, 235, 0.10);
          margin-bottom: 34px;
        }

        .message-card-header {
          padding: 24px 32px;
          background: linear-gradient(135deg, #0f9f6e 0%, #2387e8 100%);
          position: relative;
        }

        .message-card-header h2 {
          margin: 0;
          color: #ffffff;
          font-size: 26px;
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        .message-card-body {
          padding: 34px;
          background:
            radial-gradient(circle at top right, rgba(37, 99, 235, 0.08), transparent 36%),
            linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
        }

        .contact-form {
          display: grid;
          gap: 20px;
        }

        .two-col {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        label {
          display: block;
          margin-bottom: 9px;
          color: #0f172a;
          font-size: 14px;
          font-weight: 900;
        }

        input,
        select,
        textarea {
          width: 100%;
          border: 1px solid rgba(15, 23, 42, 0.12);
          border-radius: 16px;
          padding: 15px 17px;
          background: #f8fafc;
          color: #0f172a;
          font-size: 15px;
          outline: none;
          transition: all 0.2s ease;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: #2387e8;
          background: #ffffff;
          box-shadow: 0 0 0 5px rgba(35, 135, 232, 0.12);
        }

        textarea {
          min-height: 170px;
          resize: vertical;
        }

        button {
          width: fit-content;
          border: none;
          border-radius: 16px;
          padding: 15px 34px;
          background: linear-gradient(135deg, #0f172a 0%, #2563eb 100%);
          color: #ffffff;
          font-size: 15px;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 16px 30px rgba(37, 99, 235, 0.25);
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .alert {
          padding: 14px 16px;
          border-radius: 14px;
          font-weight: 800;
          margin-bottom: 18px;
        }

        .alert.success {
          background: #dcfce7;
          color: #166534;
        }

        .alert.error {
          background: #fee2e2;
          color: #991b1b;
        }

        @media (max-width: 720px) {
          .two-col {
            grid-template-columns: 1fr;
          }

          .message-card-body {
            padding: 24px 18px 28px;
          }

          button {
            width: 100%;
          }
        }
      `}</style>
      <div className="contact-container">
        <div className="contact-heading">
          <p className="contact-badge">Get In Touch</p>
          <h1>Contact Us</h1>
          <p>
            Send your message directly to our team. We will review your query and respond as soon as possible.
          </p>

          {selectedProperty ? (
            <div className="selected-property">
              Selected Property: {selectedProperty}
            </div>
          ) : null}
        </div>


        <ContactMap />


        <div className="message-card">
          <div className="message-card-header">
            <h2>Customer Message Form</h2>
          </div>

          <div className="message-card-body">
            {successMessage ? <div className="alert success">{successMessage}</div> : null}
            {errorMessage ? <div className="alert error">{errorMessage}</div> : null}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="two-col">
                <div>
                  <label>Your Name <span>*</span></label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Enter your full name" required />
                </div>

                <div>
                  <label>Email Address <span>*</span></label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter your email address" required />
                </div>
              </div>

              <div className="two-col">
                <div>
                  <label>Phone / Mobile <span>*</span></label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="Enter your phone number" required />
                </div>

                <div>
                  <label>Your Query Is For <span>*</span></label>
                  <select name="queryType" value={form.queryType} onChange={handleChange} required>
                    <option>General Inquiry</option>
                    <option>Property Enquiry</option>
                    <option>Site Visit Request</option>
                    <option>Customer Support</option>
                    <option>Business Proposal</option>
                  </select>
                </div>
              </div>

              <div>
                <label>Subject <span>*</span></label>
                <input name="subject" value={form.subject} onChange={handleChange} placeholder="Write your subject" required />
              </div>

              <div>
                <label>Your Message <span>*</span></label>
                <textarea name="message" value={form.message} onChange={handleChange} placeholder="Write your message here..." required />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>

      
    </section>
  );
}