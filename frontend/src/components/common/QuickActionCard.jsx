import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function QuickActionCard({ to, title, description, icon: Icon }) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
      <Link
        to={to}
        className="group border-border bg-card hover:border-primary flex h-full flex-col gap-4 border p-6 transition-colors"
      >
        <Icon className="text-primary size-6 shrink-0" strokeWidth={1.5} />
        <div className="flex flex-1 flex-col gap-1.5">
          <h3 className="text-foreground text-base font-semibold tracking-tight">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </div>
        <span className="text-primary flex items-center gap-1 text-[11px] font-semibold tracking-[0.1em] uppercase">
          Open <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </motion.div>
  )
}
