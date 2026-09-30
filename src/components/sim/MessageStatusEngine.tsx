import React from 'react';
import { Check, CheckCheck, Clock } from 'lucide-react';

export type MessageStatus = 'SENDING' | 'SENT' | 'DELIVERED' | 'READ';

export const MessageStatusEngine: React.FC<{ status: MessageStatus }> = ({ status }) => {
  switch (status) {
    case 'SENDING':
      return <Clock className="w-3.5 h-3.5 text-slate-400 animate-spin" />;
    case 'SENT':
      return <Check className="w-3.5 h-3.5 text-slate-400" />;
    case 'DELIVERED':
      return <CheckCheck className="w-3.5 h-3.5 text-slate-400" />;
    case 'READ':
      return <CheckCheck className="w-3.5 h-3.5 text-sky-500 font-bold" />;
    default:
      return null;
  }
};
