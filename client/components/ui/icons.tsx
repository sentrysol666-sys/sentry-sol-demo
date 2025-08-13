// Simplified Material Design Icons for Sentrysol
import React from "react";

// Import specific icons from Material UI
import DashboardIcon from "@mui/icons-material/Dashboard";
import SecurityIcon from "@mui/icons-material/Security";
import SearchIcon from "@mui/icons-material/Search";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PolicyIcon from "@mui/icons-material/Policy";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import PsychologyIcon from "@mui/icons-material/Psychology";
import ShieldIcon from "@mui/icons-material/Shield";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BarChartIcon from "@mui/icons-material/BarChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TimelineIcon from "@mui/icons-material/Timeline";
import ScheduleIcon from "@mui/icons-material/Schedule";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import ShareIcon from "@mui/icons-material/Share";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import StorageIcon from "@mui/icons-material/Storage";
import CodeIcon from "@mui/icons-material/Code";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import DescriptionIcon from "@mui/icons-material/Description";
import VerifiedIcon from "@mui/icons-material/Verified";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import InsightsIcon from "@mui/icons-material/Insights";
import GavelIcon from "@mui/icons-material/Gavel";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FlashOnIcon from "@mui/icons-material/FlashOn";

// Network specific icon (using AccountTree as NetworkIcon)
export const NetworkIcon = AccountTreeIcon;
export const BrainIcon = PsychologyIcon;
export const EyeIcon = VisibilityIcon;
export const ClockIcon = ScheduleIcon;
export const ChevronDownIcon = ExpandMoreIcon;
export const ArrowRightIcon = KeyboardArrowRightIcon;
export const ArrowLeftIcon = KeyboardArrowLeftIcon;
export const WalletIcon = AccountBalanceWalletIcon;
export const ExchangeIcon = SwapHorizIcon;
export const MoneyIcon = MonetizationOnIcon;
export const DollarIcon = AttachMoneyIcon;
export const DatabaseIcon = StorageIcon;
export const DocumentIcon = DescriptionIcon;
export const ComplianceIcon = GavelIcon;
export const ReportIcon = ReportProblemIcon;
export const ExitIcon = ExitToAppIcon;
export const ActivityIcon = TimelineIcon;
export const FlashIcon = FlashOnIcon;

// Export all the icons
export {
  DashboardIcon,
  SecurityIcon,
  SearchIcon,
  AssessmentIcon,
  PolicyIcon,
  SettingsIcon,
  ShieldIcon,
  WarningIcon,
  CheckCircleIcon,
  ErrorIcon,
  InfoIcon,
  BarChartIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  RefreshIcon,
  DownloadIcon,
  ZoomInIcon,
  ZoomOutIcon,
  RotateLeftIcon,
  FullscreenIcon,
  ShareIcon,
  NotificationsIcon,
  AccountCircleIcon,
  MenuIcon,
  CloseIcon,
  PersonIcon,
  GroupIcon,
  VerifiedIcon,
  LockIcon,
  LockOpenIcon,
  AnalyticsIcon,
  InsightsIcon,
};

// Create a mapping object for easy icon replacement
export const icons = {
  dashboard: DashboardIcon,
  security: SecurityIcon,
  search: SearchIcon,
  assessment: AssessmentIcon,
  policy: PolicyIcon,
  settings: SettingsIcon,
  network: NetworkIcon,
  brain: BrainIcon,
  shield: ShieldIcon,
  warning: WarningIcon,
  checkCircle: CheckCircleIcon,
  error: ErrorIcon,
  info: InfoIcon,
  eye: EyeIcon,
  barChart: BarChartIcon,
  trendingUp: TrendingUpIcon,
  trendingDown: TrendingDownIcon,
  clock: ClockIcon,
  refresh: RefreshIcon,
  download: DownloadIcon,
  menu: MenuIcon,
  close: CloseIcon,
  chevronDown: ChevronDownIcon,
  arrowRight: ArrowRightIcon,
  arrowLeft: ArrowLeftIcon,
  wallet: WalletIcon,
  exchange: ExchangeIcon,
  money: MoneyIcon,
  dollar: DollarIcon,
  database: DatabaseIcon,
  code: CodeIcon,
  person: PersonIcon,
  group: GroupIcon,
  document: DocumentIcon,
  verified: VerifiedIcon,
  lock: LockIcon,
  unlock: LockOpenIcon,
  analytics: AnalyticsIcon,
  insights: InsightsIcon,
  compliance: ComplianceIcon,
  report: ReportIcon,
  notifications: NotificationsIcon,
  account: AccountCircleIcon,
  activity: ActivityIcon,
  exit: ExitIcon,
  flash: FlashIcon,
};

export default icons;
