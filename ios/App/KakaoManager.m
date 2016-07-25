#import "KakaoManager.h"
#import <KakaoOpenSDK/KakaoOpenSDK.h>

@implementation KakaoManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(isKakaoTalkInstalled:(RCTResponseSenderBlock)callback)
{
  BOOL isInstalled = [KOAppCall canOpenKakaoTalkAppLink];
  callback(@[[NSNull null], [NSNumber numberWithBool:isInstalled]]);
}

RCT_EXPORT_METHOD(sendImageWithText:(NSString *)imagePath link:(NSString *)link text:(NSString *)text)
{
  KakaoTalkLinkObject *image
  = [KakaoTalkLinkObject createImage:imagePath
                               width:500
                              height:500];
  
  KakaoTalkLinkObject *label
  = [KakaoTalkLinkObject createLabel:text];
  
  KakaoTalkLinkObject *button
  = [KakaoTalkLinkObject createWebButton:@"웹에서 시간표 열기"
                                     url:link];
  
  [KOAppCall openKakaoTalkAppLink:@[image, label, button]];
}


RCT_EXPORT_METHOD(sendText:(NSString *)text)
{
  KakaoTalkLinkObject *label
  = [KakaoTalkLinkObject createLabel:text];
  [KOAppCall openKakaoTalkAppLink:@[label]];
}

@end
