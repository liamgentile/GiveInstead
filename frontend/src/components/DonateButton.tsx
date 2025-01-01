import { useEffect } from "react";

interface DonateButtonProps {
  slug: string;
  amount: number;
  disabled: boolean;  
}

const DonateButton = ({ slug, amount, disabled }: DonateButtonProps) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://embeds.every.org/0.4/button.js?explicit=1";
    script.async = true;
    script.defer = true;
    script.id = "every-donate-btn-js";

    const createWidget = () => {
      if (window.everyDotOrgDonateButton) {
        window.everyDotOrgDonateButton.createButton({
          selector: "#every-donate-btn",
        });
        window.everyDotOrgDonateButton.createWidget({
          selector: "#every-donate-btn",
          nonprofitSlug: slug,
          amount: amount,
          frequency: "ONCE",
          noExit: true,
          methods: ["card", "bank", "paypal"]
        });
      }
    };

    script.onload = createWidget;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [slug, amount]);

  return (
    <div id="every-donate-btn">
      <a
        href={`staging.every.org/${slug}#/donate`}
        className={`inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
          }
        }}
      >
        {disabled ? "Please fill out the form" : "Donate"}
      </a>
    </div>
  );
};

export default DonateButton;
