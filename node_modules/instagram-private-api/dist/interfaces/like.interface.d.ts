export declare namespace LikeModuleName {
    interface FeedTimeline {
        moduleName: 'feed_timeline' | 'feed_contextual_post' | 'newsfeed' | 'feed_contextual_newsfeed_multi_media_liked';
    }
    interface FeedContextualHashtag {
        moduleName: 'feed_contextual_hashtag';
        hashtag: string;
    }
    interface FeedContextualLocation {
        moduleName: 'feed_contextual_location';
        location_id: string | number;
    }
    interface BaseProfile {
        username: string;
        user_id: string | number;
    }
    interface Profile extends BaseProfile {
        moduleName: 'profile';
    }
    interface MediaViewProfile extends BaseProfile {
        moduleName: 'media_view_profile';
    }
    interface VideoViewProfile extends BaseProfile {
        moduleName: 'video_view_profile';
    }
    interface PhotoViewProfile extends BaseProfile {
        moduleName: 'photo_view_profile';
    }
    type Type = (FeedTimeline | FeedContextualHashtag | FeedContextualLocation | Profile | MediaViewProfile | VideoViewProfile | PhotoViewProfile) & {
        [x: string]: any;
        d: boolean;
    };
}
