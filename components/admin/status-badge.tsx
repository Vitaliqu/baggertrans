import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { BookingStatus, EquipmentStatus } from '@/types';
import { BOOKING_STATUS_LABELS } from '@/types';

const BOOKING_STATUS_VARIANT: Record<BookingStatus, 'default' | 'orange' | 'green' | 'red' | 'muted'> = {
  new: 'orange',
  confirmed: 'default',
  completed: 'green',
  cancelled: 'red',
};

const EQUIPMENT_STATUS_LABEL: Record<EquipmentStatus, string> = {
  available: 'Доступна',
  rented: 'Орендована',
  maintenance: 'Обслуговування',
};

const EQUIPMENT_STATUS_VARIANT: Record<EquipmentStatus, 'default' | 'orange' | 'green' | 'red' | 'muted'> = {
  available: 'green',
  rented: 'orange',
  maintenance: 'muted',
};

interface BookingStatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  return (
    <Badge variant={BOOKING_STATUS_VARIANT[status]} className={className}>
      {BOOKING_STATUS_LABELS[status]}
    </Badge>
  );
}

interface EquipmentStatusBadgeProps {
  status: EquipmentStatus;
  className?: string;
}

export function EquipmentStatusBadge({ status, className }: EquipmentStatusBadgeProps) {
  return (
    <Badge variant={EQUIPMENT_STATUS_VARIANT[status]} className={className}>
      {EQUIPMENT_STATUS_LABEL[status]}
    </Badge>
  );
}
