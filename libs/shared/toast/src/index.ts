import { toast } from 'ngx-sonner';

export function toastSuccess() {
  toast.success('Great success!');
}

export function toastError(error?: string) {
  toast.error('Oh, noez!', {
    description: error,
  });
}
