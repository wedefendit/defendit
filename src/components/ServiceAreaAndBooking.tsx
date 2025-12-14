import { BookOnline } from "./BookOnline";
import ServiceAreaMap from "./ServiceAreaMap";

export default function ServiceAreaAndBooking() {
  return (
    <section className="mt-12 text-center space-y-4">
      <ServiceAreaMap />
      <BookOnline />
    </section>
  );
}

export { ServiceAreaAndBooking };
