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
          "Remote IT Support & Cybersecurity Services | Defend I.T.",
        description:
          "Professional remote IT support and cybersecurity services available nationwide. Remote tech support, security assessments, virus removal, privacy hardening, and tech tutoring. Expert help from Florida-based technicians.",
        url: "https://www.wedefendit.com/services/remote",
        image: "https://www.wedefendit.com/og-image.png",
        keywords:
          "remote IT support, remote tech support nationwide, remote cybersecurity services, online tech tutoring, remote malware removal, remote computer help, virtual IT support",
      }}
      h1="Remote IT Support & Cybersecurity Services"
      services={remote.services}
      remote={true}
    />
  );
}
