#import "NaverLineManager.h"
@import UIKit;

@implementation NaverLineManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(isLineInstalled:(RCTResponseSenderBlock)callback)
{
  BOOL isLineInstalled = [[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"line://"]];
  callback(@[[NSNull null], [NSNumber numberWithBool:isLineInstalled]]);
}

RCT_EXPORT_METHOD(shareImage:(NSString *)imagePath)
{
  UIPasteboard *pasteboard;
  UIImage *image = [UIImage imageWithContentsOfFile:imagePath];
  
  if (NSFoundationVersionNumber > NSFoundationVersionNumber_iOS_6_1) {
    pasteboard = [UIPasteboard generalPasteboard];
  } else {
    pasteboard = [UIPasteboard pasteboardWithName:@"jp.naver.linecamera.pasteboard" create:YES];
  }
  [pasteboard setData:UIImageJPEGRepresentation(image, 0.8) forPasteboardType:@"public.jpeg"];
  [[UIApplication sharedApplication] openURL:[NSURL URLWithString:[NSString stringWithFormat:@"line://msg/image/%@", pasteboard.name]]];
}
@end
