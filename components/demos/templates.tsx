import { ShopDashboard } from "@/registry/templates/shop-dashboard";
import { AuthPage } from "@/registry/templates/auth";
import { StartupLanding } from "@/registry/templates/startup-landing";
import { PricingPage } from "@/registry/templates/pricing";
import { AiChat } from "@/registry/templates/ai-chat";
import { InvoicePage } from "@/registry/templates/invoice";
import { BlogPost } from "@/registry/templates/blog";
import { SettingsPage } from "@/registry/templates/settings";
import { CheckoutPage } from "@/registry/templates/checkout";
import { StorePage } from "@/registry/templates/store";
import { OnboardingPage } from "@/registry/templates/onboarding";
import { AdminOrdersPage } from "@/registry/templates/admin-orders";
import { BookingPage } from "@/registry/templates/booking";
import { WalletPage } from "@/registry/templates/wallet";
import { ErrorPagesDemo } from "@/registry/templates/error-pages";
import { EmailPreview } from "@/registry/templates/email";
import { SaasLanding } from "@/registry/templates/saas-landing";
import { FinanceDashboard } from "@/registry/templates/finance-dashboard";
import { FoodDelivery } from "@/registry/templates/food-delivery";
import { KanbanBoard } from "@/registry/templates/kanban";
import { CoursePage } from "@/registry/templates/course";
import { PaymentReceipt } from "@/registry/templates/receipt";
import { TravelSearch } from "@/registry/templates/travel-search";
import { ComingSoon } from "@/registry/templates/coming-soon";
import { RealEstatePage } from "@/registry/templates/real-estate";
import { SupportPage } from "@/registry/templates/support";
import { RidePage } from "@/registry/templates/ride";
import { JobsPage } from "@/registry/templates/jobs";
import { PosPage } from "@/registry/templates/pos";
import { CrmPage } from "@/registry/templates/crm";
import { TeamCalendarPage } from "@/registry/templates/team-calendar";

export const templateComponents: Record<string, React.ComponentType> = {
  "shop-dashboard": ShopDashboard,
  auth: AuthPage,
  "startup-landing": StartupLanding,
  pricing: PricingPage,
  "ai-chat": AiChat,
  invoice: InvoicePage,
  blog: BlogPost,
  settings: SettingsPage,
  checkout: CheckoutPage,
  store: StorePage,
  onboarding: OnboardingPage,
  "admin-orders": AdminOrdersPage,
  booking: BookingPage,
  wallet: WalletPage,
  "error-pages": ErrorPagesDemo,
  email: EmailPreview,
  "saas-landing": SaasLanding,
  "finance-dashboard": FinanceDashboard,
  "food-delivery": FoodDelivery,
  kanban: KanbanBoard,
  course: CoursePage,
  receipt: PaymentReceipt,
  "travel-search": TravelSearch,
  "coming-soon": ComingSoon,
  "real-estate": RealEstatePage,
  support: SupportPage,
  ride: RidePage,
  jobs: JobsPage,
  pos: PosPage,
  crm: CrmPage,
  "team-calendar": TeamCalendarPage,
};
