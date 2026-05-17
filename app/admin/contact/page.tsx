import { Topbar } from "@/components/layout/topbar";
import { mockContacts } from "@/lib/mock-data";
import { ContactList } from "./contact-list";

export const dynamic = "force-dynamic";

export default function ContactPage() {
  return (
    <div className="flex flex-col flex-1">
      <Topbar title="Contact Submissions" description="Messages from your website visitors" />
      <main className="flex-1 p-6">
        <ContactList initialSubmissions={mockContacts} />
      </main>
    </div>
  );
}
