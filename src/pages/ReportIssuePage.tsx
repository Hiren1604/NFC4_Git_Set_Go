import { API_BASE_URL } from "@/constants";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addIssue } from "@/store/slices/issuesSlice";
import { setActiveItem } from "@/store/slices/navigationSlice";
import {
  Wrench,
  Zap,
  Home,
  Shield,
  Layers,
  Bot,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Send,
  ArrowUp,
  Mic,
  MicOff,
  RotateCcw,
  Activity,
  Star,
} from "lucide-react";

interface ReportIssuePageProps {
  onBack?: () => void;
  onNavigate?: (item: string) => void;
  user?: any;
}

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
  suggestions?: { label: string; value: string; icon?: any }[];
  isDraftCard?: boolean;
  isConfirmationCard?: boolean;
  draftData?: any;
  ticketData?: any;
}

// Formatted Markdown Message Renderer (Strips raw ** and renders semantic elements)
function FormattedMessage({ text }: { text: string }) {
  if (!text) return null;

  // Split into paragraphs by double linebreaks
  const paragraphs = text.split(/\n\n+/);

  const renderInlineText = (str: string) => {
    // Regex splits by **bold text**
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
        const cleanBold = part.slice(2, -2);
        return (
          <strong key={index} className="font-bold text-foreground tracking-tight">
            {cleanBold}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-2 text-xs sm:text-sm">
      {paragraphs.map((para, pIdx) => {
        const lines = para.split(/\n/);
        const isBulletList = lines.every(
          (l) => l.trim().startsWith("• ") || l.trim().startsWith("- ") || l.trim().startsWith("* ")
        );

        if (isBulletList) {
          return (
            <ul key={pIdx} className="space-y-1 my-1.5 pl-1">
              {lines.map((line, lIdx) => {
                const cleanLine = line.replace(/^[•\-*]\s*/, "");
                return (
                  <li key={lIdx} className="flex items-start gap-2">
                    <span className="text-primary mt-1 text-[8px] select-none shrink-0">●</span>
                    <span className="leading-relaxed">{renderInlineText(cleanLine)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        return (
          <p key={pIdx} className="leading-relaxed">
            {lines.map((line, lIdx) => (
              <span key={lIdx} className={lIdx > 0 ? "block mt-1" : "inline"}>
                {renderInlineText(line)}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export default function ReportIssuePage({ onBack, onNavigate, user: propUser }: ReportIssuePageProps) {
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.auth.user);
  const user = propUser || reduxUser;
  const residentName = user?.name ? user.name.split(" ")[0] : "Neighbor";
  const residentFlat = user ? `${user.building || "Tower A"} • Flat ${user.flatNumber || "101"}` : "Tower A • Flat 101";

  // Grievance Extraction State Interface
  interface TriageState {
    category: string | null;
    title: string;
    description: string;
    location: string;
    priority: "urgent" | "high" | "medium" | "low" | null;
    stage: "greeting" | "details" | "urgency" | "timing" | "ready" | "dispatched";
    technicianName: string | null;
    technicianTrade: string | null;
    technicianRate: number | null;
    technicianPhone?: string | null;
  }

  const [triageState, setTriageState] = useState<TriageState>({
    category: null,
    title: "",
    description: "",
    location: residentFlat,
    priority: null,
    stage: "greeting",
    technicianName: null,
    technicianTrade: null,
    technicianRate: null,
    technicianPhone: null,
  });

  const [inputMessage, setInputMessage] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial welcome message with clean formatting
  const initialMessages: ChatMessage[] = [
    {
      id: "msg-welcome-1",
      sender: "ai",
      text: `Hello ${residentName}! 👋 I'm your Society AI Maintenance Concierge.\n\nWhat issue or grievance can I help you resolve in **${residentFlat}** today? You can tap an issue domain below or describe it in your own words.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestions: [
        { label: "💧 Water Leak / Plumbing", value: "Water leak or plumbing problem in my flat", icon: Wrench },
        { label: "⚡ Electrical / Power Tripping", value: "Electrical switch, MCB, or light socket issue", icon: Zap },
        { label: "🛗 Lift / Elevator Malfunction", value: "Elevator not working or stopped between floors", icon: Layers },
        { label: "🚪 Door Lock / Carpentry", value: "Door hinge, lock, or window carpentry repair", icon: Home },
        { label: "🧹 Garbage / Common Cleaning", value: "Corridor sanitation, spill, or garbage chute problem", icon: Sparkles },
        { label: "🛡️ Intercom / Gate Access", value: "Gate security, intercom, or barrier issue", icon: Shield },
      ],
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiTyping]);

  // Speech-to-Text handler
  const handleToggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your message.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-IN";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
        inputRef.current?.focus();
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  // Helper to parse user intent from text (used for offline/fallback mode)
  const parseIntent = (text: string) => {
    const lower = text.toLowerCase();
    let detectedCat: string | null = null;
    let detectedPriority: "urgent" | "high" | "medium" | "low" = triageState.priority || "medium";

    // Category detection
    if (
      lower.includes("leak") ||
      lower.includes("pipe") ||
      lower.includes("water") ||
      lower.includes("flush") ||
      lower.includes("tap") ||
      lower.includes("drain") ||
      lower.includes("sink") ||
      lower.includes("bathroom") ||
      lower.includes("plumb")
    ) {
      detectedCat = "plumbing";
    } else if (
      lower.includes("power") ||
      lower.includes("spark") ||
      lower.includes("mcb") ||
      lower.includes("switch") ||
      lower.includes("wire") ||
      lower.includes("light") ||
      lower.includes("socket") ||
      lower.includes("electric") ||
      lower.includes("short")
    ) {
      detectedCat = "electrical";
    } else if (lower.includes("lift") || lower.includes("elevator")) {
      detectedCat = "elevator";
    } else if (
      lower.includes("door") ||
      lower.includes("lock") ||
      lower.includes("window") ||
      lower.includes("hinge") ||
      lower.includes("cabinet") ||
      lower.includes("carpent") ||
      lower.includes("drawer")
    ) {
      detectedCat = "carpentry";
    } else if (
      lower.includes("gate") ||
      lower.includes("intercom") ||
      lower.includes("guard") ||
      lower.includes("security") ||
      lower.includes("parking")
    ) {
      detectedCat = "security";
    } else if (
      lower.includes("spill") ||
      lower.includes("garbage") ||
      lower.includes("clean") ||
      lower.includes("corridor") ||
      lower.includes("trash")
    ) {
      detectedCat = "cleaning";
    }

    // Urgency detection
    const isUrgent =
      lower.includes("flood") ||
      lower.includes("spark") ||
      lower.includes("smoke") ||
      lower.includes("fire") ||
      lower.includes("trapped") ||
      lower.includes("burst") ||
      lower.includes("shock") ||
      lower.includes("overflow") ||
      lower.includes("emergency") ||
      lower.includes("urgent");

    const isHigh =
      lower.includes("leak") ||
      lower.includes("power") ||
      lower.includes("blackout") ||
      lower.includes("broken") ||
      lower.includes("jammed") ||
      lower.includes("tripping");

    if (isUrgent) detectedPriority = "urgent";
    else if (isHigh && detectedPriority !== "urgent") detectedPriority = "high";

    const techCatalog: Record<string, { name: string; trade: string; rate: number }> = {
      plumbing: { name: "Rajesh Kumar", trade: "Master Plumber", rate: 800 },
      electrical: { name: "Amit Singh", trade: "Certified Electrician", rate: 900 },
      elevator: { name: "Ramesh Iyer", trade: "Elevator Engineer", rate: 1000 },
      carpentry: { name: "Suresh Patel", trade: "Senior Carpenter", rate: 700 },
      security: { name: "Vikram Malhotra", trade: "Security Systems Specialist", rate: 600 },
      cleaning: { name: "Priya Sharma", trade: "Sanitation Supervisor", rate: 500 },
    };

    const activeCat = detectedCat || triageState.category;
    const tech = activeCat ? techCatalog[activeCat] : null;

    return {
      category: detectedCat,
      priority: detectedPriority,
      technicianName: tech ? tech.name : null,
      technicianTrade: tech ? tech.trade : null,
      technicianRate: tech ? tech.rate : null,
    };
  };

  // Main chat processing engine connecting to live Backend AI Triage
  const handleSendMessage = async (textToSend?: string) => {
    const rawText = textToSend || inputMessage;
    const text = rawText.trim();
    if (!text) return;

    // Fast-path: Check if user clicked or typed confirm
    const lower = text.toLowerCase();
    if (
      lower.includes("confirm & dispatch") ||
      lower.includes("yes, dispatch") ||
      lower.includes("confirm dispatch") ||
      lower.includes("send technician") ||
      lower === "confirm"
    ) {
      setInputMessage("");
      dispatchTicketToDatabase();
      return;
    }

    // Append user message
    const userMsgId = `user-${Date.now()}`;
    const newMessages: ChatMessage[] = [
      ...messages,
      {
        id: userMsgId,
        sender: "user",
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];

    setMessages(newMessages);
    setInputMessage("");
    setIsAiTyping(true);

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Icon map for suggestions
    const getSuggestionIcon = (str: string) => {
      const s = str.toLowerCase();
      if (s.includes("water") || s.includes("leak") || s.includes("plumb") || s.includes("tap") || s.includes("drain")) return Wrench;
      if (s.includes("electric") || s.includes("power") || s.includes("spark") || s.includes("mcb") || s.includes("light")) return Zap;
      if (s.includes("lift") || s.includes("elevator")) return Layers;
      if (s.includes("door") || s.includes("lock") || s.includes("carpent") || s.includes("window")) return Home;
      if (s.includes("clean") || s.includes("garbage") || s.includes("spill")) return Sparkles;
      if (s.includes("gate") || s.includes("security") || s.includes("guard")) return Shield;
      if (s.includes("confirm") || s.includes("dispatch")) return CheckCircle2;
      return Activity;
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/issues/triage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-5).map((m) => ({ sender: m.sender, text: m.text })),
          currentCategory: triageState.category,
          currentPriority: triageState.priority,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      setIsAiTyping(false);

      const detectedCat = data.category || triageState.category;
      const detectedPriority = data.priority || triageState.priority;
      const tech = data.technician;

      const tradeCatalog: Record<string, string> = {
        plumbing: "Master Plumber",
        electrical: "Certified Electrician",
        elevator: "Elevator Engineer",
        carpentry: "Senior Carpenter",
        cleaning: "Sanitation Specialist",
        security: "Security Specialist",
        parking: "Parking Warden",
        garden: "Landscape Technician",
      };

      if (detectedCat) {
        setTriageState((prev) => ({
          ...prev,
          category: detectedCat,
          priority: prev.priority || detectedPriority || "medium",
          technicianName: tech ? tech.name : prev.technicianName,
          technicianTrade: detectedCat ? tradeCatalog[detectedCat] || "Maintenance Specialist" : prev.technicianTrade,
          technicianRate: tech ? tech.hourlyRate : prev.technicianRate,
          technicianPhone: tech ? tech.phone : prev.technicianPhone,
          title: prev.title || (text.length < 50 && !/^(hi|hello|hey|namaste|start)\b/i.test(text) ? text : `${detectedCat.toUpperCase()} Issue in ${residentFlat}`),
          description: prev.description ? `${prev.description} | ${text}` : text,
          stage: data.isReadyForDraft ? "ready" : "details",
        }));
      }

      const mappedSuggestions = (data.suggestions || []).map((s: any) => ({
        label: s.label,
        value: s.value,
        icon: getSuggestionIcon(s.label + " " + s.value),
      }));

      if (data.isReadyForDraft && detectedCat) {
        const finalPrio = triageState.priority || detectedPriority || "medium";
        const draftData = {
          title: triageState.title || text,
          description: triageState.description ? `${triageState.description} | ${text}` : text,
          category: detectedCat,
          priority: finalPrio,
          location: residentFlat,
          technicianName: tech?.name || triageState.technicianName || "Certified Technician",
          technicianTrade: tradeCatalog[detectedCat] || "Maintenance Specialist",
          technicianRate: tech?.hourlyRate || triageState.technicianRate || 800,
          technicianPhone: tech?.phone || triageState.technicianPhone,
          eta: (finalPrio === "urgent") ? "Under 30 mins (Emergency SLA)" : finalPrio === "high" ? "Within 1 - 2 hours" : "Within 2 - 4 hours",
        };

        setMessages((prev) => [
          ...prev,
          {
            id: `ai-draft-${Date.now()}`,
            sender: "ai",
            text: data.reply || `I have diagnosed your grievance and prepared an autonomous technician dispatch for Flat ${user?.flatNumber || "101"}.\n\nPlease review your summary draft below:`,
            timestamp: timeStr,
            isDraftCard: true,
            draftData,
            suggestions: mappedSuggestions,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-reply-${Date.now()}`,
            sender: "ai",
            text: data.reply,
            timestamp: timeStr,
            suggestions: mappedSuggestions,
          },
        ]);
      }
    } catch (err) {
      console.warn("AI Triage API call failed, falling back to local engine:", err);
      setIsAiTyping(false);
      const intent = parseIntent(text);
      generateAiResponse(text, intent);
    }
  };

  // Generate dynamic conversational AI reply with follow-up suggestions (Local Fallback)
  const generateAiResponse = (userText: string, intent: any) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const lower = userText.toLowerCase().trim();

    // 1. Check for Greeting
    const isGreeting = /^(hi|hello|hey|good\s*(morning|afternoon|evening)|namaste|hola|yo|start|menu)\b/i.test(lower);
    if (isGreeting) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-greet-${Date.now()}`,
          sender: "ai",
          text: `Hello ${residentName}! 👋 How can I help you in **${residentFlat}** today?\n\nTell me what problem you are facing, or choose an issue domain below to get started:`,
          timestamp: timeStr,
          suggestions: [
            { label: "💧 Water Leak / Plumbing", value: "Water leak or plumbing problem in my flat", icon: Wrench },
            { label: "⚡ Electrical / MCB Tripping", value: "Electrical switch, MCB, or light socket issue", icon: Zap },
            { label: "🛗 Lift / Elevator Malfunction", value: "Elevator not working or stopped between floors", icon: Layers },
            { label: "🚪 Door Lock / Carpentry", value: "Door hinge, lock, or window carpentry repair", icon: Home },
            { label: "🧹 Garbage / Common Cleaning", value: "Corridor sanitation, spill, or garbage chute problem", icon: Sparkles },
            { label: "🛡️ Intercom / Gate Access", value: "Gate security, intercom, or barrier issue", icon: Shield },
          ],
        },
      ]);
      return;
    }

    // 2. Check for Help
    const isHelp = /^(who\s*are\s*you|what\s*can\s*you\s*do|what\s*is\s*this|help|help\s*me|how\s*does\s*this\s*work)\b/i.test(lower);
    if (isHelp) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-help-${Date.now()}`,
          sender: "ai",
          text: `I am Emerald Heights' automated **AI Maintenance Concierge**! 🤖\n\nYou can chat with me about any maintenance issue in your flat. I will diagnose the problem, evaluate urgency, match a certified on-duty technician, and schedule assistance.\n\nWhat problem would you like to report?`,
          timestamp: timeStr,
          suggestions: [
            { label: "💧 Water Leak", value: "Water leak or plumbing problem in my flat", icon: Wrench },
            { label: "⚡ Electrical Fault", value: "Electrical switch, MCB, or light socket issue", icon: Zap },
            { label: "🛗 Lift Malfunction", value: "Elevator not working or stopped between floors", icon: Layers },
            { label: "🚪 Carpentry / Lock", value: "Door hinge, lock, or window carpentry repair", icon: Home },
          ],
        },
      ]);
      return;
    }

    // 3. Check for Pleasantries
    const isThanks = /^(thanks|thank\s*you|awesome|great|perfect|cool|ok|okay)\b/i.test(lower);
    if (isThanks) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-thanks-${Date.now()}`,
          sender: "ai",
          text: `You're very welcome! 😊 Let me know if there's any grievance or repair needed in your apartment.`,
          timestamp: timeStr,
          suggestions: [
            { label: "💧 File Plumbing Grievance", value: "Water leak or plumbing problem in my flat", icon: Wrench },
            { label: "⚡ File Electrical Grievance", value: "Electrical switch, MCB, or light socket issue", icon: Zap },
            { label: "📋 View My Grievances", value: "GO_TO_MY_ISSUES", icon: CheckCircle2 },
          ],
        },
      ]);
      return;
    }

    const currentCat = intent.category || triageState.category;
    const currentTitle = triageState.title || (currentCat ? `${currentCat.toUpperCase()} Grievance` : userText);
    const currentDesc = triageState.description || userText;

    if (currentCat) {
      setTriageState((prev) => ({ ...prev, stage: "ready" }));

      const finalPrio = triageState.priority || intent.priority || "medium";
      const draftData = {
        title: currentTitle,
        description: currentDesc,
        category: currentCat,
        priority: finalPrio,
        location: residentFlat,
        technicianName: intent.technicianName || "Certified Technician",
        technicianTrade: intent.technicianTrade || "Specialist",
        technicianRate: intent.technicianRate || 800,
        eta: finalPrio === "urgent" ? "Under 30 mins (Priority SLA)" : "Within 1 - 2 hours",
      };

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-draft-${Date.now()}`,
          sender: "ai",
          text: `I've diagnosed the grievance and prepared an autonomous technician dispatch for your flat.\n\nPlease review your summary draft below:`,
          timestamp: timeStr,
          isDraftCard: true,
          draftData,
          suggestions: [
            { label: "🚀 Confirm & Dispatch Technician", value: "Confirm & dispatch technician now" },
            { label: "🕒 Schedule for Afternoon", value: "Please schedule for afternoon 2:00 PM" },
            { label: "✏️ Modify Details", value: "Change details" },
          ],
        },
      ]);
      return;
    }

    // Fallback general prompt
    setMessages((prev) => [
      ...prev,
      {
        id: `ai-gen-${Date.now()}`,
        sender: "ai",
        text: `I'm here to help! Could you specify what needs repair or select a category below?`,
        timestamp: timeStr,
        suggestions: [
          { label: "💧 Water / Plumbing Issue", value: "Water leak or plumbing problem in my flat", icon: Wrench },
          { label: "⚡ Electrical / Power Issue", value: "Electrical switch, MCB, or light socket issue", icon: Zap },
          { label: "🚪 Door / Lock / Carpentry", value: "Door hinge, lock, or window carpentry repair", icon: Home },
          { label: "🧹 Cleaning / Common Area", value: "Corridor sanitation, spill, or garbage chute problem", icon: Sparkles },
        ],
      },
    ]);
  };

  // Submit issue to real backend API & database
  const dispatchTicketToDatabase = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("You must be logged in to file a grievance.");
      }

      const finalCategory = triageState.category || "other";
      const finalPriority = triageState.priority || "medium";
      const finalTitle = triageState.title || `${finalCategory.toUpperCase()} Maintenance in ${residentFlat}`;
      const finalDesc = triageState.description || `Resident reported ${finalCategory} issue in ${residentFlat}`;

      const payload = {
        title: finalTitle.slice(0, 95),
        description: finalDesc.length >= 5 ? finalDesc : `${finalDesc} - resident requested immediate resolution.`,
        category: finalCategory,
        priority: finalPriority,
        location: { area: residentFlat },
      };

      const res = await fetch(`${API_BASE_URL}/issues`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error ||
            (data.errors && data.errors[0]?.msg) ||
            "Failed to register grievance in database"
        );
      }

      const createdIssue = data.issue;
      dispatch(addIssue(createdIssue));
      setTriageState((prev) => ({
        ...prev,
        stage: "dispatched",
        technicianName: createdIssue.assignedTo?.name || prev.technicianName,
        technicianTrade: prev.technicianTrade,
        technicianRate: createdIssue.assignedTo?.hourlyRate || prev.technicianRate,
      }));

      // Add success confirmation card directly in the chat stream
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-success-${Date.now()}`,
          sender: "ai",
          text: `🎉 **Grievance Confirmed & Dispatched!**\n\nYour grievance is registered in the society ledger and assigned to on-duty personnel.`,
          timestamp: timeStr,
          isConfirmationCard: true,
          ticketData: createdIssue,
          suggestions: [
            { label: "📋 View in My Grievances", value: "GO_TO_MY_ISSUES" },
            { label: "🏠 Return to Dashboard", value: "GO_TO_DASHBOARD" },
            { label: "🔄 Report Another Grievance", value: "RESET_CHAT" },
          ],
        },
      ]);
    } catch (err: any) {
      console.error("Chat dispatch error:", err);
      setSubmitError(err.message || "Failed to connect to the society server.");
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-error-${Date.now()}`,
          sender: "ai",
          text: `⚠️ **Dispatch Error:** ${err.message || "Could not register issue in the database"}.\n\nPlease try again or verify your connection.`,
          timestamp: timeStr,
          suggestions: [
            { label: "🔄 Retry Dispatch", value: "Confirm & dispatch technician now" },
            { label: "🏠 Back to Dashboard", value: "GO_TO_DASHBOARD" },
          ],
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle special action suggestions
  const handleSuggestionClick = (value: string) => {
    if (value === "GO_TO_MY_ISSUES") {
      if (onNavigate) onNavigate("my-issues");
      dispatch(setActiveItem("my-issues"));
      return;
    }

    if (value === "GO_TO_DASHBOARD") {
      if (onNavigate) onNavigate("dashboard");
      dispatch(setActiveItem("dashboard"));
      return;
    }

    if (value === "RESET_CHAT") {
      setMessages(initialMessages);
      setTriageState({
        category: null,
        title: "",
        description: "",
        location: residentFlat,
        priority: null,
        stage: "greeting",
        technicianName: null,
        technicianTrade: null,
        technicianRate: null,
        technicianPhone: null,
      });
      setInputMessage("");
      return;
    }

    handleSendMessage(value);
  };

  const currentPriority = triageState.priority || "medium";

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] max-w-5xl mx-auto w-full rounded-2xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl shadow-xl overflow-hidden relative">
      {/* Top ChatGPT-Style Header with Priority Switcher */}
      <div className="shrink-0 flex items-center justify-between px-3 sm:px-5 py-2.5 border-b border-border/70 bg-card/60 backdrop-blur-md z-10">
        <div className="flex items-center gap-2.5">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-8 w-8 rounded-lg shrink-0 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="relative">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-primary to-emerald-500 text-white flex items-center justify-center shadow-xs">
              <Bot className="h-4 w-4" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-background animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-bold tracking-tight text-foreground">
                Society AI Concierge
              </h2>
              <Badge variant="outline" className="font-mono text-[9px] text-primary border-primary/30 bg-primary/5 py-0 px-1.5 h-4 hidden sm:inline-flex">
                Live Triage
              </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Flat {user?.flatNumber || "101"} • Instant Maintenance & Dispatch
            </p>
          </div>
        </div>

        {/* Priority Selector & Restart Controls */}
        <div className="flex items-center gap-2">
          {/* Priority Level Chooser Pills */}
          <div className="flex items-center gap-1 bg-secondary/60 p-1 rounded-xl border border-border/60">
            <span className="text-[10px] font-semibold text-muted-foreground px-1 hidden md:inline">
              Priority:
            </span>
            {(["low", "medium", "high", "urgent"] as const).map((p) => {
              const isSelected = currentPriority === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setTriageState((prev) => ({ ...prev, priority: p }))}
                  className={`text-[10px] capitalize font-bold px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? p === "urgent"
                        ? "bg-rose-500 text-white shadow-xs"
                        : p === "high"
                        ? "bg-amber-500 text-white shadow-xs"
                        : "bg-primary text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  }`}
                  title={`Set Priority to ${p.toUpperCase()}`}
                >
                  {p === "urgent" ? "🚨 Urgent" : p}
                </button>
              );
            })}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleSuggestionClick("RESET_CHAT")}
            className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"
            title="New Chat"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Main Chat Message Stream (Takes remaining height, scrolls internally) */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "ai" && (
              <Avatar className="h-8 w-8 shrink-0 mt-0.5 ring-2 ring-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}

            <div className="space-y-2.5 max-w-[88%] sm:max-w-[82%]">
              {/* Message Bubble with Clean Formatted Markdown */}
              <div
                className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                  msg.sender === "user"
                    ? "bg-primary text-white rounded-tr-xs ml-auto shadow-sm"
                    : "bg-secondary/70 dark:bg-slate-800/80 text-foreground border border-border/70 rounded-tl-xs backdrop-blur-md"
                }`}
              >
                <FormattedMessage text={msg.text} />
                <span
                  className={`block text-[10px] mt-1.5 font-mono ${
                    msg.sender === "user" ? "text-white/70 text-right" : "text-muted-foreground text-left"
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {/* Grievance Draft Card (Rendered inside AI bubble) */}
              {msg.isDraftCard && msg.draftData && (
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3.5 text-xs shadow-xs animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-primary/15">
                    <div className="flex items-center gap-1.5 font-bold text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Grievance Summary Draft</span>
                    </div>
                    <Badge
                      variant={currentPriority === "urgent" ? "destructive" : "secondary"}
                      className="text-[10px] uppercase font-mono"
                    >
                      {currentPriority} Urgency
                    </Badge>
                  </div>

                  {/* Priority Level Selector inside Draft Card */}
                  <div className="p-2.5 rounded-lg bg-background/60 border border-border/60 space-y-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground block">
                      Choose Priority Level:
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(["low", "medium", "high", "urgent"] as const).map((p) => {
                        const isCurrent = currentPriority === p;
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => {
                              setTriageState((prev) => ({ ...prev, priority: p }));
                            }}
                            className={`py-1 px-1.5 rounded-md text-[10px] font-bold border transition-all cursor-pointer ${
                              isCurrent
                                ? p === "urgent"
                                  ? "bg-rose-500 border-rose-500 text-white shadow-xs"
                                  : p === "high"
                                  ? "bg-amber-500 border-amber-500 text-white shadow-xs"
                                  : "bg-primary border-primary text-white shadow-xs"
                                : "border-border/80 bg-background text-muted-foreground hover:border-foreground/30"
                            }`}
                          >
                            {p === "urgent" ? "🚨 Urgent" : p.toUpperCase()}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="text-muted-foreground">
                      Problem: <strong className="text-foreground">{msg.draftData.title}</strong>
                    </div>
                    <div className="text-muted-foreground">
                      Domain: <strong className="text-foreground capitalize">{msg.draftData.category}</strong>
                    </div>
                    <div className="text-muted-foreground">
                      Premise: <strong className="text-foreground">{msg.draftData.location}</strong>
                    </div>
                    <div className="text-muted-foreground">
                      Auto-Matched Personnel:{" "}
                      <strong className="text-foreground">
                        {msg.draftData.technicianName} ({msg.draftData.technicianTrade})
                      </strong>
                    </div>
                    <div className="text-muted-foreground">
                      Standard Trade Rate:{" "}
                      <strong className="text-emerald-600 font-mono">
                        ₹{msg.draftData.technicianRate} / hr
                      </strong>
                    </div>
                    <div className="text-muted-foreground">
                      Estimated Response:{" "}
                      <strong className="text-primary font-mono">{msg.draftData.eta}</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-primary/15">
                    <Button
                      onClick={dispatchTicketToDatabase}
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-xs h-9 rounded-xl shadow-md cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Activity className="h-3.5 w-3.5 animate-spin" /> Dispatching to Database...
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          Confirm & Dispatch Now 🚀
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Confirmation Success Card */}
              {msg.isConfirmationCard && msg.ticketData && (
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-4 space-y-3 text-xs shadow-md animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Active Society Ticket</span>
                    </div>
                    <span className="font-mono font-bold text-foreground text-xs">
                      #ISS-{msg.ticketData._id ? msg.ticketData._id.slice(-6).toUpperCase() : "RECORDED"}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="text-muted-foreground">
                      Title: <strong className="text-foreground">{msg.ticketData.title}</strong>
                    </div>
                    <div className="text-muted-foreground">
                      Status:{" "}
                      <Badge className="bg-primary/10 text-primary capitalize text-[10px] ml-1">
                        {msg.ticketData.status || "Assigned"}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground">
                      Assigned To:{" "}
                      <strong className="text-foreground">
                        {msg.ticketData.assignedTo?.name || triageState.technicianName}
                      </strong>{" "}
                      ({msg.ticketData.assignedTo?.phone || "+91 98765 43210"})
                    </div>
                    <div className="text-muted-foreground">
                      Estimated Arrival: <strong className="text-foreground font-mono">Within 30 minutes</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-500/20 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigate && onNavigate("my-issues")}
                      className="text-xs h-8 flex-1 rounded-lg border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10"
                    >
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      View Grievances & Feedback
                    </Button>
                  </div>
                </div>
              )}

              {/* Suggestive Button Chips */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.suggestions.map((sug, idx) => {
                    const Icon = sug.icon;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSuggestionClick(sug.value)}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/25 bg-primary/5 hover:bg-primary/15 text-primary text-xs font-medium transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-2xs"
                      >
                        {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
                        <span>{sug.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {msg.sender === "user" && (
              <Avatar className="h-8 w-8 shrink-0 mt-0.5 ring-2 ring-primary/20">
                <AvatarFallback className="bg-primary text-white font-bold text-xs">
                  {residentName[0] || "U"}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        {/* AI Typing Indicator */}
        {isAiTyping && (
          <div className="flex gap-3 justify-start items-center">
            <Avatar className="h-8 w-8 shrink-0 ring-2 ring-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="px-3.5 py-2.5 rounded-2xl bg-secondary/60 border border-border/60 text-xs text-muted-foreground flex items-center gap-2">
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
              </span>
              <span>AI Concierge is evaluating grievance...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Docked ChatGPT-Style Text Composer (Always pinned at bottom) */}
      <div className="shrink-0 p-3 sm:p-4 border-t border-border/70 bg-card/90 backdrop-blur-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center rounded-2xl border border-border/80 bg-background/95 dark:bg-slate-900/90 shadow-sm focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/50 transition-all p-1.5"
        >
          {/* Voice Dictation Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleToggleVoice}
            className={`h-9 w-9 rounded-xl shrink-0 transition-colors ${
              isListening
                ? "bg-rose-500/10 text-rose-600 animate-pulse"
                : "text-muted-foreground hover:text-primary hover:bg-secondary/60"
            }`}
            title={isListening ? "Listening... click to stop" : "Speak your message via microphone"}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>

          {/* Seamless Text Input */}
          <input
            ref={inputRef}
            type="text"
            placeholder={
              isListening
                ? "Listening... please speak now"
                : "Message Society AI Concierge... (e.g. water tap leaking)"
            }
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isSubmitting}
            className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/70 outline-none border-none min-w-0"
          />

          {/* ChatGPT-Style Send Button */}
          <Button
            type="submit"
            disabled={!inputMessage.trim() || isSubmitting}
            size="icon"
            className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90 text-white shrink-0 cursor-pointer disabled:opacity-30 transition-all shadow-xs"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-muted-foreground px-2 pt-1.5">
          <span>💡 Tap suggested options above or press Enter to send</span>
          {isListening && <span className="text-rose-500 font-mono animate-pulse">● Listening...</span>}
        </div>
      </div>
    </div>
  );
}
