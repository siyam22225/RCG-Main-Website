"use client";

import { useMemo, useState } from "react";

type VacancyOption = {
  id: string;
  title: string;
  department: string;
  location: string;
  jobType: string;
  maxCvSizeMb: number;
};

type CareerApplyFormProps = {
  vacancies: VacancyOption[];
  customPositions: string[];
  labels: {
    openApplicationLabel: string;
    preferredPositionLabel: string;
    preferredPositionPlaceholder: string;
  };
};

export default function CareerApplyForm({
  vacancies,
  customPositions,
  labels,
}: CareerApplyFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [selectedOption, setSelectedOption] = useState("open-application");
  const [customPosition, setCustomPosition] = useState("");

  const selectedVacancy = useMemo(
    () => vacancies.find((vacancy) => selectedOption === `vacancy:${vacancy.id}`) || null,
    [selectedOption, vacancies]
  );

  const selectedAdminPosition = useMemo(() => {
    if (!selectedOption.startsWith("position:")) return "";
    const index = Number(selectedOption.replace("position:", ""));
    return customPositions[index] || "";
  }, [selectedOption, customPositions]);

  const selectedMaxCvSizeMb = selectedVacancy?.maxCvSizeMb || 5;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const cvFile = formData.get("cv");

    if (cvFile instanceof File && cvFile.size > selectedMaxCvSizeMb * 1024 * 1024) {
      setStatus("error");
      setMessage(`CV file size must be within ${selectedMaxCvSizeMb} MB.`);
      return;
    }

    const position =
      selectedVacancy?.title ||
      selectedAdminPosition ||
      customPosition.trim() ||
      "Open Application";

    formData.set("position", position);
    formData.set("vacancyId", selectedVacancy?.id || "");

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/career/apply", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Submission failed.");
      }

      form.reset();
      setSelectedOption("open-application");
      setCustomPosition("");
      setStatus("success");
      setMessage("Your application has been submitted successfully.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  return (
    <form className="career-form" onSubmit={handleSubmit}>
      <input type="hidden" name="vacancyId" value={selectedVacancy?.id || ""} />
      <input
        type="hidden"
        name="position"
        value={selectedVacancy?.title || selectedAdminPosition || customPosition}
      />

      <div className="form-row full">
        <label>Applying For *</label>
        <select
          value={selectedOption}
          onChange={(event) => setSelectedOption(event.target.value)}
          required
        >
          <option value="open-application">{labels.openApplicationLabel}</option>

          {customPositions.map((position, index) => (
            <option key={`${position}-${index}`} value={`position:${index}`}>
              {position}
            </option>
          ))}

          {vacancies.map((vacancy) => (
            <option key={vacancy.id} value={`vacancy:${vacancy.id}`}>
              {vacancy.title} — {vacancy.department}
            </option>
          ))}
        </select>
      </div>

      {selectedOption === "open-application" ? (
        <div className="form-row full">
          <label>{labels.preferredPositionLabel} *</label>
          <input
            type="text"
            value={customPosition}
            onChange={(event) => setCustomPosition(event.target.value)}
            placeholder={labels.preferredPositionPlaceholder}
            required
          />
        </div>
      ) : null}

      <div className="form-grid">
        <div className="form-row">
          <label>Full Name *</label>
          <input name="name" type="text" placeholder="Your full name" required />
        </div>

        <div className="form-row">
          <label>Phone Number *</label>
          <input name="phone" type="tel" placeholder="Your phone number" required />
        </div>

        <div className="form-row">
          <label>Email Address *</label>
          <input name="email" type="email" placeholder="Your email address" required />
        </div>

        <div className="form-row">
          <label>Experience</label>
          <input name="experience" type="text" placeholder="Example: 2 years / Fresher" />
        </div>
      </div>

      <div className="form-row full">
        <label>Short Message</label>
        <textarea name="message" rows={4} placeholder="Write a short message about your interest" />
      </div>

      <div className="form-row full cv-box">
        <label>Upload CV *</label>
        <input name="cv" type="file" accept=".pdf,.doc,.docx" required />
        <small>Accepted format: PDF, DOC, DOCX. Maximum size: {selectedMaxCvSizeMb} MB.</small>
      </div>

      <button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Submitting..." : "Submit Application"}
      </button>

      {message ? (
        <p className={status === "success" ? "success-message" : "error-message"}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
