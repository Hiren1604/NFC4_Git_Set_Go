import { Users, ShieldCheck, Wrench } from "lucide-react";

export const PORTALS = {
  resident: { label: "Resident", icon: Users, title: "Your society. Powered by AI.", subtitle: "You live. AI triages. Your society moves. Requests, payments, and people, connected.", heading: "Welcome home", items: [["Kitchen tap repair", "In progress"], ["Monthly maintenance", "Paid"], ["Community notice", "View notice"]] },
  admin: { label: "Admin", icon: ShieldCheck, title: "A clearer view of your society.", subtitle: "Manage requests, payments, and the people who keep things running.", heading: "Society overview", items: [["Assign a maintenance request", "Needs review"], ["Maintenance collections", "View ledger"], ["Community announcement", "Published"]] },
  technician: { label: "Personnel", icon: Wrench, title: "Your next job. Made simple.", subtitle: "See assigned work, update progress, and track completed jobs.", heading: "Your workspace", items: [["Kitchen tap repair · Tower A", "Assigned"], ["Lift inspection · Tower B", "In progress"], ["Garden lighting", "Completed"]] },
};

