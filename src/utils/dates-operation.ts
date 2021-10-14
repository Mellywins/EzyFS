export class DatesOperations {
  static getDayDuration(startDate: Date, endDate: Date): number {
    const durationInTime = endDate.getTime() - startDate.getTime();
    const durationInDays = durationInTime / (1000 * 3600 * 24);
    return durationInDays;
  }
}
