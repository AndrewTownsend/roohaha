export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Andrew V. Townsend",
    url: "https://roohaha.com",
    jobTitle: "Senior Full Stack Software Engineer",
    description:
      "From early-stage startups to Fortune 10 enterprises — building systems at every scale for nearly two decades.",
    sameAs: [
      "https://www.linkedin.com/in/andrew-townsend-6876836/",
      "https://github.com/AndrewTownsend",
    ],
    knowsAbout: [
      "TypeScript",
      "Golang",
      "React",
      "Next.js",
      "AWS",
      "Kubernetes",
      "Kafka",
    ],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Dickinson College",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Herndon",
      addressRegion: "VA",
      addressCountry: "US",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
