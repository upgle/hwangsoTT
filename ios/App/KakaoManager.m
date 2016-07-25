#import "KakaoManager.h"
#import <KakaoOpenSDK/KakaoOpenSDK.h>

@implementation KakaoManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(isKakaoTalkInstalled:(RCTResponseSenderBlock)callback)
{
  BOOL isInstalled = [KOAppCall canOpenKakaoTalkAppLink];
  callback(@[[NSNull null], [NSNumber numberWithBool:isInstalled]]);
}

RCT_EXPORT_METHOD(sendText:(NSString *)text)
{
  KakaoTalkLinkObject *label
  = [KakaoTalkLinkObject createLabel:text];
  [KOAppCall openKakaoTalkAppLink:@[label]];
}

@end
