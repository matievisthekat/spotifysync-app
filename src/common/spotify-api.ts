declare namespace Spotify {
  interface SearchForItemParameterObject {
    q?: string;
    type?: string;
    market?: string;
    limit?: number;
    offset?: number;
  }

  interface RecommendationsOptionsObject {
    limit?: number;
    market?: string;
    max_acousticness?: number;
    max_danceability?: number;
    max_duration_ms?: number;
    max_energy?: number;
    max_instrumentalness?: number;
    max_key?: number;
    max_liveness?: number;
    max_loudness?: number;
    max_mode?: number;
    max_popularity?: number;
    max_speechiness?: number;
    max_tempo?: number;
    max_time_signature?: number;
    max_valence?: number;
    min_acousticness?: number;
    min_danceability?: number;
    min_duration_ms?: number;
    min_energy?: number;
    min_instrumentalness?: number;
    min_key?: number;
    min_liveness?: number;
    min_loudness?: number;
    min_mode?: number;
    min_popularity?: number;
    min_speechiness?: number;
    min_tempo?: number;
    min_time_signature?: number;
    min_valence?: number;
    seed_artists?: string; // Comma separated string
    seed_genres?: string; // Comma separated string
    seed_tracks?: string; // Comma separated string
    target_acousticness?: number;
    target_danceability?: number;
    target_duration_ms?: number;
    target_energy?: number;
    target_instrumentalness?: number;
    target_key?: number;
    target_liveness?: number;
    target_loudness?: number;
    target_mode?: number;
    target_popularity?: number;
    target_speechiness?: number;
    target_tempo?: number;
    target_time_signature?: number;
    target_valence?: number;
  }

  interface VoidResponse {}

  interface PlaylistSnapshotResponse {
    snapshot_id: string;
  }

  interface SingleAlbumResponse extends AlbumObjectFull {}

  interface MultipleAlbumsResponse {
    albums: AlbumObjectFull[];
  }

  interface AlbumTracksResponse extends PagingObject<TrackObjectSimplified> {}

  interface SingleArtistResponse extends ArtistObjectFull {}

  interface MultipleArtistsResponse {
    artists: ArtistObjectFull[];
  }

  interface ArtistsAlbumsResponse extends PagingObject<AlbumObjectSimplified> {}

  interface ArtistsTopTracksResponse {
    tracks: TrackObjectFull[];
  }

  interface ArtistsRelatedArtistsResponse {
    artists: ArtistObjectFull[];
  }

  interface AudioAnalysisResponse extends Object {}

  interface AudioFeaturesResponse extends AudioFeaturesObject {}

  interface MultipleAudioFeaturesResponse {
    audio_features: AudioFeaturesObject[];
  }

  interface ListOfFeaturedPlaylistsResponse {
    message?: string;
    playlists: PagingObject<PlaylistObjectSimplified>;
  }

  interface ListOfNewReleasesResponse {
    message?: string;
    albums: PagingObject<AlbumObjectSimplified>;
  }

  interface MultipleCategoriesResponse {
    categories: PagingObject<CategoryObject>;
  }

  interface SingleCategoryResponse extends CategoryObject {}

  interface CategoryPlaylistsReponse {
    playlists: PagingObject<PlaylistObjectSimplified>;
  }

  interface CurrentUsersProfileResponse extends UserObjectPrivate {}

  interface UsersFollowedArtistsResponse {
    artists: CursorBasedPagingObject<ArtistObjectFull>;
  }

  interface FollowArtistsOrUsersResponse extends VoidResponse {}

  interface UnfollowArtistsOrUsersResponse extends VoidResponse {}

  interface UserFollowsUsersOrArtistsResponse extends Array<boolean> {}

  interface FollowPlaylistReponse extends VoidResponse {}

  interface UnfollowPlaylistReponse extends VoidResponse {}

  interface SaveTracksForUserResponse extends VoidResponse {}

  interface UsersSavedTracksResponse extends PagingObject<SavedTrackObject> {}

  interface RemoveUsersSavedTracksResponse extends VoidResponse {}

  interface CheckUsersSavedTracksResponse extends Array<boolean> {}

  interface SaveAlbumsForUserResponse extends VoidResponse {}

  /**
   * Get user's saved albums
   *
   * GET /v1/me/albums
   * https://developer.spotify.com/web-api/get-users-saved-albums/
   */
  interface UsersSavedAlbumsResponse extends PagingObject<SavedAlbumObject> {}

  /**
   * Remove Albums for Current User
   *
   * DELETE /v1/me/albums?ids={ids}
   * https://developer.spotify.com/web-api/remove-albums-user/
   */
  interface RemoveAlbumsForUserResponse extends VoidResponse {}

  /**
   * Check user's saved albums
   *
   * GET /v1/me/albums/contains?ids={ids}
   * https://developer.spotify.com/web-api/check-users-saved-albums/
   */
  interface CheckUserSavedAlbumsResponse extends Array<boolean> {}

  /**
   * Get a User’s Top Artists and Tracks (Note: This is only Artists)
   *
   * GET /v1/me/top/{type}
   * https://developer.spotify.com/web-api/get-users-top-artists-and-tracks/
   */
  interface UsersTopArtistsResponse extends PagingObject<ArtistObjectFull> {}

  /**
   * Get a User’s Top Artists and Tracks (Note: This is only Tracks)
   *
   * GET /v1/me/top/{type}
   * https://developer.spotify.com/web-api/get-users-top-artists-and-tracks/
   */
  interface UsersTopTracksResponse extends PagingObject<TrackObjectFull> {}

  /**
   * Get recommendations based on seeds
   *
   * GET /v1/recommendations
   * https://developer.spotify.com/get-recommendations/
   */
  interface RecommendationsFromSeedsResponse extends RecommendationsObject {}

  /**
   * Get available genre seeds
   *
   * GET /v1/recommendations/available-genre-seeds
   * https://developer.spotify.com/web-api/get-recommendations/#available-genre-seeds
   */
  interface AvailableGenreSeedsResponse {
    genres: string[];
  }

  /**
   * Search for an album
   *
   * GET /v1/search?type=album
   * https://developer.spotify.com/web-api/search-item/
   */
  interface AlbumSearchResponse {
    albums: PagingObject<AlbumObjectSimplified>;
  }

  /**
   * Search for an artist
   *
   * GET /v1/search?type=artist
   * https://developer.spotify.com/web-api/search-item/
   */
  interface ArtistSearchResponse {
    artists: PagingObject<ArtistObjectFull>;
  }

  /**
   * Search for a playlist
   *
   * GET /v1/search?type=playlist
   * https://developer.spotify.com/web-api/search-item/
   */
  interface PlaylistSearchResponse {
    playlists: PagingObject<PlaylistObjectSimplified>;
  }

  /**
   * Search for a track
   *
   * GET /v1/search?type=track
   * https://developer.spotify.com/web-api/search-item/
   */
  interface TrackSearchResponse {
    tracks: PagingObject<TrackObjectFull>;
  }

  /**
   * Get a track
   *
   * GET /v1/tracks/{id}
   * https://developer.spotify.com/web-api/get-track/
   */
  interface SingleTrackResponse extends TrackObjectFull {}

  /**
   * Get multiple tracks
   *
   * GET /v1/tracks?ids={ids}
   * https://developer.spotify.com/web-api/get-several-tracks/
   */
  interface MultipleTracksResponse {
    tracks: TrackObjectFull[];
  }

  /**
   * Get user profile
   *
   * GET /v1/users/{user_id}
   * https://developer.spotify.com/web-api/get-users-profile/
   */
  interface UserProfileResponse extends UserObjectPublic {}

  /**
   * Get a list of a user's playlists
   *
   * GET /v1/users/{user_id}/playlists
   * https://developer.spotify.com/web-api/get-list-users-playlists/
   */
  interface ListOfUsersPlaylistsResponse extends PagingObject<PlaylistObjectSimplified> {}

  /**
   * Get a list of the current user's playlists
   *
   * GET /v1/me/playlists
   * https://developer.spotify.com/web-api/get-list-users-playlists/
   */
  interface ListOfCurrentUsersPlaylistsResponse extends PagingObject<PlaylistObjectSimplified> {}

  /**
   * Get a playlist
   *
   * GET /v1/users/{user_id}/playlists/{playlist_id}
   * https://developer.spotify.com/web-api/get-playlist/
   */
  interface SinglePlaylistResponse extends PlaylistObjectFull {}

  /**
   * Get a playlist's tracks
   *
   * GET /v1/users/{user_id}/playlists/{playlist_id}/tracks
   * https://developer.spotify.com/web-api/get-playlists-tracks/
   */
  interface PlaylistTrackResponse extends PagingObject<PlaylistTrackObject> {}

  /**
   * Create a Playlist
   *
   * POST /v1/users/{user_id}/playlists
   * https://developer.spotify.com/web-api/create-playlist/
   */
  interface CreatePlaylistResponse extends PlaylistObjectFull {}

  /**
   * Change a Playlist’s Details
   *
   * PUT /v1/users/{user_id}/playlists/{playlist_id}
   * https://developer.spotify.com/web-api/change-playlist-details/
   */
  interface ChangePlaylistDetailsReponse extends VoidResponse {}

  /**
   * Add Tracks to a Playlist
   *
   * POST /v1/users/{user_id}/playlists/{playlist_id}/tracks
   * https://developer.spotify.com/web-api/add-tracks-to-playlist/
   */
  interface AddTracksToPlaylistResponse extends PlaylistSnapshotResponse {}

  /**
   * Remove Tracks from a Playlist
   *
   * DELETE /v1/users/{user_id}/playlists/{playlist_id}/tracks
   * https://developer.spotify.com/web-api/remove-tracks-playlist/
   */
  interface RemoveTracksFromPlaylistResponse extends PlaylistSnapshotResponse {}

  /**
   * Reorder a Playlist’s Tracks
   *
   * PUT /v1/users/{user_id}/playlists/{playlist_id}/tracks
   * https://developer.spotify.com/web-api/reorder-playlists-tracks/
   */
  interface ReorderPlaylistTracksResponse extends PlaylistSnapshotResponse {}

  /**
   * Replace a Playlist’s Tracks
   *
   * PUT /v1/users/{user_id}/playlists/{playlist_id}/tracks
   * https://developer.spotify.com/web-api/replace-playlists-tracks/
   */
  interface ReplacePlaylistTracksResponse extends VoidResponse {}

  /**
   * Check if Users Follow a Playlist
   *
   * GET /v1/users/{user_id}/playlists/{playlist_id}/followers/contains
   * https://developer.spotify.com/web-api/check-user-following-playlist/
   */
  interface UsersFollowPlaylistReponse extends Array<boolean> {}

  //
  // Objects from the Object Models of the Spotify Web Api, ordered alphabetically.
  // [Object Model](https://developer.spotify.com/web-api/object-model)
  //

  /**
   * Full Album Object
   * [album object (full)](https://developer.spotify.com/web-api/object-model/#album-object-simplified)
   */
  interface AlbumObjectFull extends AlbumObjectSimplified {
    artists: ArtistObjectSimplified[];
    copyrights: CopyrightObject[];
    external_ids: ExternalIdObject;
    genres: string[];
    popularity: number;
    release_date: string;
    release_date_precision: string;
    tracks: PagingObject<TrackObjectSimplified>;
  }

  /**
   * Simplified Album Object
   * [album object (simplified)](https://developer.spotify.com/web-api/object-model/#album-object-simplified)
   */
  interface AlbumObjectSimplified {
    album_type: string;
    available_markets?: string[];
    external_urls: ExternalUrlObject;
    href: string;
    id: string;
    images: ImageObject[];
    name: string;
    type: "album";
    uri: string;
  }

  /**
   * Full Artist Object
   * [artist object (full)](https://developer.spotify.com/web-api/object-model/)
   */
  interface ArtistObjectFull extends ArtistObjectSimplified {
    followers: FollowersObject;
    genres: string[];
    images: ImageObject[];
    popularity: number;
  }

  /**
   * Simplified Artist Object
   * [artist object (simplified)](https://developer.spotify.com/web-api/object-model/)
   */
  interface ArtistObjectSimplified {
    external_urls: ExternalUrlObject;
    href: string;
    id: string;
    name: string;
    type: "artist";
    uri: string;
  }

  /**
   * Audio Features Object
   * https://developer.spotify.com/web-api/object-model/#audio-features-object
   */
  interface AudioFeaturesObject {
    acousticness: number;
    analysis_url: string;
    danceability: number;
    duration_ms: number;
    energy: number;
    id: string;
    instrumentalness: number;
    key: number;
    liveness: number;
    loudness: number;
    mode: number;
    speechiness: number;
    tempo: number;
    time_signature: number;
    track_href: string;
    type: "audio_features";
    uri: string;
    valence: number;
  }

  /**
   * Category Object
   * [category object](https://developer.spotify.com/web-api/object-model/)
   */
  interface CategoryObject {
    href: string;
    icons: ImageObject[];
    id: string;
    name: string;
  }

  /**
   * Copyright object
   * [copyright object](https://developer.spotify.com/web-api/object-model/)
   */
  interface CopyrightObject {
    text: string;
    type: "C" | "P";
  }

  /**
   * Cursor object
   * [cursor object](https://developer.spotify.com/web-api/object-model/)
   */
  interface CursorObject {
    after: string;
  }

  /**
   * Error object
   * [error object](https://developer.spotify.com/web-api/object-model/)
   */
  interface ErrorObject {
    status: number;
    message: string;
  }

  /**
   * External Id object
   * [](https://developer.spotify.com/web-api/object-model/)
   *
   * Note that there might be other types available, it couldn't be found in the docs.
   */
  interface ExternalIdObject {
    isrc?: string;
    ean?: string;
    upc?: string;
  }

  /**
   * External Url Object
   * [](https://developer.spotify.com/web-api/object-model/)
   *
   * Note that there might be other types available, it couldn't be found in the docs.
   */
  interface ExternalUrlObject {
    spotify: string;
  }

  /**
   * Followers Object
   * [](https://developer.spotify.com/web-api/object-model/)
   */
  interface FollowersObject {
    href: string;
    total: number;
  }

  /**
   * Image Object
   * [](https://developer.spotify.com/web-api/object-model/)
   */
  interface ImageObject {
    height?: number;
    url: string;
    width?: number;
  }

  /**
   * Paging Object wrapper used for retrieving collections from the Spotify API.
   * [](https://developer.spotify.com/web-api/object-model/#paging-object)
   */
  interface PagingObject<T> {
    href: string;
    items: T[];
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
  }

  /**
   * Cursor Based Paging Object wrappers used for retrieving collections from the Spotify API.
   * [](https://developer.spotify.com/web-api/object-model/#cursor-based-paging-object)
   */
  interface CursorBasedPagingObject<T> {
    href: string;
    items: T[];
    limit: number;
    next: string;
    cursors: CursorObject;
    total: number;
  }

  /**
   * Base Playlist Object. Does not in itself exist in Spotify Web Api,
   * but needs to be made since the tracks types vary in the Full and Simplified versions.
   */
  interface PlaylistBaseObject {
    collaborative: boolean;
    external_urls: ExternalUrlObject;
    href: string;
    id: string;
    images: ImageObject[];
    name: string;
    owner: UserObjectPublic;
    public: boolean;
    snapshot_id: string;
    type: "playlist";
    uri: string;
  }

  /**
   * Playlist Object Full
   * [](https://developer.spotify.com/web-api/object-model/)
   */
  interface PlaylistObjectFull extends PlaylistBaseObject {
    description: string;
    followers: FollowersObject;
    tracks: PagingObject<PlaylistTrackObject>;
  }

  /**
   * Playlist Object Simplified
   * [](https://developer.spotify.com/web-api/object-model/)
   */
  interface PlaylistObjectSimplified extends PlaylistBaseObject {
    tracks: {
      href: string;
      total: number;
    };
  }

  /**
   * The Track Object in Playlists
   * [](https://developer.spotify.com/web-api/object-model/)
   */
  interface PlaylistTrackObject {
    added_at: string;
    added_by: UserObjectPublic;
    is_local: boolean;
    track: TrackObjectFull;
  }

  /**
   * Recommendations Object
   * [](https://developer.spotify.com/web-api/object-model/#recommendations-object)
   */
  interface RecommendationsObject {
    seeds: RecommendationsSeedObject[];
    tracks: TrackObjectSimplified[];
  }

  /**
   * Recommendations Seed Object
   * [](https://developer.spotify.com/web-api/object-model/#recommendations-seed-object)
   */
  interface RecommendationsSeedObject {
    afterFilteringSize: number;
    afterRelinkingSize: number;
    href: string;
    id: string;
    initialPoolSize: number;
    type: "artist" | "track" | "genre";
  }

  /**
   * Saved Track Object in Playlists
   * [](https://developer.spotify.com/web-api/object-model/)
   */
  interface SavedTrackObject {
    added_at: string;
    track: TrackObjectFull;
  }

  /**
   * Saved Track Object in Playlists
   * [](https://developer.spotify.com/web-api/object-model/)
   */
  interface SavedAlbumObject {
    added_at: string;
    album: AlbumObjectFull;
  }

  /**
   * Full Track Object
   * [track object (full)](https://developer.spotify.com/web-api/object-model/#track-object-full)
   */
  interface TrackObjectFull extends TrackObjectSimplified {
    album: AlbumObjectSimplified;
    external_ids: ExternalIdObject;
    popularity: number;
  }

  /**
   * Simplified Track Object
   * [track object (simplified)](https://developer.spotify.com/web-api/object-model/#track-object-simplified)
   */
  interface TrackObjectSimplified {
    artists: ArtistObjectSimplified[];
    available_markets?: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_urls: ExternalUrlObject;
    href: string;
    id: string;
    is_playable?: boolean;
    linked_from?: TrackLinkObject;
    name: string;
    preview_url: string;
    track_number: number;
    type: "track";
    uri: string;
  }

  /**
   * Track Link Object
   * [](https://developer.spotify.com/web-api/object-model/#track-object-simplified)
   */
  interface TrackLinkObject {
    external_urls: ExternalUrlObject;
    href: string;
    id: string;
    type: "track";
    uri: string;
  }

  /**
   * User Object (Private)
   * [](https://developer.spotify.com/web-api/object-model/#track-object-simplified)
   */
  interface UserObjectPrivate extends UserObjectPublic {
    birthdate: string;
    country: string;
    email: string;
    product: string;
  }

  /**
   * User Object (Public)
   * [](https://developer.spotify.com/web-api/object-model/#track-object-simplified)
   */
  interface UserObjectPublic {
    display_name?: string;
    external_urls: ExternalUrlObject;
    followers?: FollowersObject;
    href: string;
    id: string;
    images?: ImageObject[];
    type: "user";
    uri: string;
  }
}

export default Spotify;
