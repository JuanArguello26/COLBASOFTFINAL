import { AlertRepository } from '../repositories/AlertRepository';
import { LogRepository } from '../repositories/LogRepository';

export class AlertService {
  static getAll(leida?: boolean) {
    return AlertRepository.findAll(leida);
  }

  static getUnread() {
    return AlertRepository.findUnread();
  }

  static markAsRead(id: number, userId: number) {
    const result = AlertRepository.markAsRead(id);
    
    if (result) {
      LogRepository.create({
        user_id: userId,
        accion: 'MARCAR_ALERTA_LEIDA',
        entidad: 'alert',
        entidad_id: id,
        detalle: 'Alerta marcada como leída'
      });
    }
    
    return result;
  }

  static markAllAsRead(userId: number) {
    const count = AlertRepository.markAllAsRead();
    
    LogRepository.create({
      user_id: userId,
      accion: 'MARCAR_TODAS_ALERTAS_LEIDAS',
      entidad: 'alert',
      detalle: `${count} alertas marcadas como leídas`
    });
    
    return count;
  }

  static delete(id: number, userId: number) {
    return AlertRepository.delete(id);
  }

  static getCount() {
    return AlertRepository.getCount();
  }
}
