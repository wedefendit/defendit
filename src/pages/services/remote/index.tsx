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

import remote from "@/data/services/remote/data.json";
import { ServicePage } from "@/components";

export default function RemoteServicesPage() {
  return (
    <ServicePage
      meta={{
        title:
          "Remote Tech Support, Online Training & Cybersecurity Help | Defend I.T. Solutions",
        description:
          "Remote tech tutoring, online training, privacy help, and plan-based remote support from Defend I.T. Solutions. Tutoring and training are available online, while support-plan services are for Central Florida clients.",
        url: "https://www.wedefendit.com/services/remote",
        image: "https://www.wedefendit.com/og-image.png",
        keywords:
          "remote tech support, online tech training, remote cybersecurity tutoring, remote privacy help, remote malware removal, Central Florida remote support plan, online computer help",
      }}
      h1="Remote Tech Support, Online Training & Cybersecurity Help"
      services={remote.services}
      remote={true}
    />
  );
}
