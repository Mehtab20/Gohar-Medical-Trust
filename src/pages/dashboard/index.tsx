import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/providers/auth-provider";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  Bed,
  FlaskConical,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  Stethoscope,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const statCards = [
  {
    title: "Total Patients",
    value: "2,847",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-100 dark:bg-blue-900/20",
  },
  {
    title: "Today's Appointments",
    value: "48",
    change: "+8%",
    trend: "up",
    icon: Calendar,
    color: "text-indigo-600",
    bg: "bg-indigo-100 dark:bg-indigo-900/20",
  },
  {
    title: "Bed Occupancy",
    value: "72%",
    change: "-5%",
    trend: "down",
    icon: Bed,
    color: "text-emerald-600",
    bg: "bg-emerald-100 dark:bg-emerald-900/20",
  },
  {
    title: "Pending Lab Results",
    value: "23",
    change: "+3",
    trend: "up",
    icon: FlaskConical,
    color: "text-amber-600",
    bg: "bg-amber-100 dark:bg-amber-900/20",
  },
  {
    title: "Today's Revenue",
    value: "₨ 245,000",
    change: "+15%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
    bg: "bg-green-100 dark:bg-green-900/20",
  },
  {
    title: "Monthly Revenue",
    value: "₨ 3.2M",
    change: "+22%",
    trend: "up",
    icon: TrendingUp,
    color: "text-purple-600",
    bg: "bg-purple-100 dark:bg-purple-900/20",
  },
];

const quickActions = [
  { label: "New Patient", icon: UserPlus, href: "/patients/new", color: "text-blue-600" },
  { label: "Book Appointment", icon: Calendar, href: "/appointments/new", color: "text-indigo-600" },
  { label: "New Lab Order", icon: FlaskConical, href: "/lab/orders/new", color: "text-amber-600" },
  { label: "Admit Patient", icon: Stethoscope, href: "/patients/admit", color: "text-emerald-600" },
];

const recentActivity = [
  { action: "New patient registered", detail: "Ahmed Ali - Outpatient", time: "2 min ago" },
  { action: "Appointment completed", detail: "Dr. Khan with Fatima Bibi", time: "15 min ago" },
  { action: "Lab result uploaded", detail: "CBC - Muhammad Usman", time: "28 min ago" },
  { action: "Invoice paid", detail: "Invoice #INV-0042", time: "1 hour ago" },
  { action: "Bed assigned", detail: "Ward 3, Bed 12 - Sameer Ahmed", time: "2 hours ago" },
];

export default function DashboardPage() {
  const { user } = useAuthContext();

  return (
    <PageContainer>
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {user?.name?.split(" ")[0] ?? "User"}
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening at Gohar Medical Trust today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
      >
        {statCards.map((card) => (
          <motion.div key={card.title} variants={itemVariants}>
            <Card className="stat-card h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`rounded-lg p-2 ${card.bg}`}>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <div className="mt-1 flex items-center gap-1 text-xs">
                  {card.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-600" />
                  )}
                  <span className={card.trend === "up" ? "text-green-600" : "text-red-600"}>
                    {card.change}
                  </span>
                  <span className="text-muted-foreground">vs yesterday</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions + Recent Activity */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {quickActions.map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 rounded-lg border p-3 transition-all hover:bg-accent hover:border-accent"
                >
                  <div className="rounded-lg bg-muted p-2">
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </a>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-2 w-2 rounded-full bg-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.detail}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageContainer>
  );
}
