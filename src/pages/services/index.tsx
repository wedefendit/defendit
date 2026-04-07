/*
Copyright © 2025 Defend I.T. Solutions LLC. All Rights Reserved.

This software and its source code are the proprietary property of
Defend I.T. Solutions LLC and are protected by United States and
international copyright laws. Unauthorized reproduction, distribution,
modification, display, or use of this software, in whole or in part, without the
prior written permission of Defend I.T. Solutions LLC, is strictly prohibited.

This software is provided for use only by authorized employees, contractors, or
licensees of Defend I.T. Solutions LLC and may not be disclosed to any third
party without express written consent.
*/

import jsonData from "@/data/services/list.json";
import { Service, ServicePage } from "@/components/Service";
// import { useLocationRedirect } from "@/hooks/useLocationRedirect";

export default function ServicesPage() {
  // useLocationRedirect(true); // auto-redirects if match found

  const canonical = "https://www.wedefendit.com/services";
  const services = jsonData.services as Service[]; // expects { name, slug, description? }

  return (
    <ServicePage
      meta={{
        title:
          "Computer Repair, Virus Removal & Wi-Fi Help in Central Florida | Defend I.T. Solutions",
        description:
          "Practical, local help with computer repair, virus removal, scam protection, Wi-Fi and home network issues, on-site tech support, and password manager setup for homes and small businesses in Ocala, Belleview, The Villages, and nearby Central Florida communities",
        image: "https://www.wedefendit.com/og-image.png",
        url: canonical,
        canonical,
        keywords:
          "computer repair Ocala, virus removal Ocala, scam protection The Villages, Wi-Fi help Belleview, on-site tech support Central Florida, password manager setup Ocala, local tech help",
      }}
      h1="Local Computer Repair, Virus Removal & Wi-Fi Help"
      services={services}
    />
  );
}
