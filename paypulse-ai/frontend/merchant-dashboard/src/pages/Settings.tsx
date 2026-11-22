import React, { useState } from 'react';
import { User, Bell, Palette, Shield, ChevronRight, Save } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { DemoBanner } from '../components/common/DemoBanner';
import { PlaceholderNote } from '../components/common/DemoBanner';

function SettingsSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 bg-slate-50">
        <div className="text-slate-500">{icon}</div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function Toggle({ label, description, defaultChecked = false }: { label: string; description?: string; defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-900">{label}</p>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => setOn(o => !o)}
        className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none ${
          on ? 'bg-blue-600' : 'bg-slate-200'
        }`}
        title="Toggle setting (placeholder)"
      >
        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}

function FieldRow({ label, value, placeholder }: { label: string; value?: string; placeholder?: string }) {
  return (
    <div className="grid grid-cols-3 gap-4 items-center py-1">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        defaultValue={value}
        placeholder={placeholder}
        className="col-span-2 input text-sm"
        readOnly
        title="Field editing will be available after backend integration"
      />
    </div>
  );
}

export default function Settings() {
  return (
    <div className="space-y-6">
      <DemoBanner />
      <PageHeader
        title="Settings"
        description="Manage your merchant profile, notifications, and dashboard preferences."
        actions={
          <button className="btn-secondary text-xs" title="Save is a placeholder — no backend yet">
            <Save className="w-3.5 h-3.5" /> Save Changes (Placeholder)
          </button>
        }
      />

      <div className="max-w-2xl space-y-6">
        {/* Merchant Profile */}
        <SettingsSection icon={<User className="w-4 h-4" />} title="Merchant Profile">
          <FieldRow label="Business Name"  value="PayPulse Demo Merchant"   />
          <FieldRow label="Contact Email"  value="demo@paypulse.ai"         />
          <FieldRow label="Merchant ID"    value="merch-001"                />
          <FieldRow label="Country"        value="India"                    />
          <FieldRow label="Currency"       value="INR (₹ Indian Rupee)"    />
          <p className="text-xs text-slate-400">Profile editing will be available after authentication is implemented (Phase 2).</p>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection icon={<Bell className="w-4 h-4" />} title="Notification Preferences">
          <Toggle label="Fraud Alerts"         description="Notify when high-risk transactions are detected" defaultChecked />
          <Toggle label="Provider Health Alerts" description="Notify when a provider degrades or goes offline"  defaultChecked />
          <Toggle label="Payment Failures"     description="Notify on payment failure events"                defaultChecked />
          <Toggle label="Recovery Outcomes"    description="Notify when a failed payment is recovered"       defaultChecked />
          <Toggle label="Weekly Summary Report" description="Weekly digest of payment analytics"                            />
          <div className="pt-2 border-t border-slate-100">
            <PlaceholderNote label="Notification delivery not implemented" />
          </div>
        </SettingsSection>

        {/* Dashboard preferences */}
        <SettingsSection icon={<Palette className="w-4 h-4" />} title="Dashboard Preferences">
          <Toggle label="Compact Table View"   description="Show fewer columns in transaction tables"             />
          <Toggle label="Show AI Confidence"   description="Display AI confidence scores on insights" defaultChecked />
          <Toggle label="Demo Data Banner"      description="Show the demo data reminder banner"       defaultChecked />
          <div className="pt-2 border-t border-slate-100">
            <PlaceholderNote label="Preference persistence not implemented" />
          </div>
        </SettingsSection>

        {/* Security */}
        <SettingsSection icon={<Shield className="w-4 h-4" />} title="Security">
          <div className="space-y-3">
            {[
              { label: 'Change Password',          note: 'Authentication not implemented — Phase 2' },
              { label: 'Two-Factor Authentication', note: 'Available after auth implementation'      },
              { label: 'API Key Management',        note: 'Available after backend implementation'  },
              { label: 'Webhook Secret Rotation',   note: 'Available in Phase 8 (Webhooks)'         },
            ].map(item => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-not-allowed"
                title={item.note}
              >
                <div>
                  <p className="text-sm font-medium text-slate-500">{item.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.note}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            ))}
          </div>
        </SettingsSection>

        <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Settings are read-only in this demo. </span>
            Full settings management will be available once the backend API is implemented in Phase 2
            and authentication is added.
          </p>
        </div>
      </div>
    </div>
  );
}

