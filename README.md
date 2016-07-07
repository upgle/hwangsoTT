

## 수정사항

```
RCT_EXPORT_METHOD(scheduleLocalNotification:(UILocalNotification *)notification)
{
  notification.repeatInterval = NSCalendarUnitWeekOfYear;
  [RCTSharedApplication() scheduleLocalNotification:notification];
}
```