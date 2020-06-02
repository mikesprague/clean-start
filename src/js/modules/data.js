import dayjs from 'dayjs';

export function setData(key, data) {
  const dataToSet = JSON.stringify(data);
  localStorage.setItem(key, dataToSet);
}

export function getData(key) {
  const dataToGet = localStorage.getItem(key);
  return JSON.parse(dataToGet);
}

export function clearData(key) {
  localStorage.removeItem(key);
}

export function resetData() {
  localStorage.clear();
}

export function isCached(key) {
  return getData(key) !== null;
}

export function isCacheValid(key, duration, durationType) {
  const lastUpdated = getData(key);
  const nextUpdateTime = dayjs(lastUpdated).add(duration, durationType);
  if (dayjs().isAfter(nextUpdateTime) || lastUpdated === null) {
    return false;
  }
  return true;
}

export function exampleUnsplashApiData() {
  return {
    'id': 'dXy2PDCBDcE',
    'created_at': '2018-10-10T23:51:00-04:00',
    'updated_at': '2019-10-02T13:23:31-04:00',
    'promoted_at': '2018-10-12T09:11:43-04:00',
    'width': 5440,
    'height': 3627,
    'color': '#EAAF9E',
    'description': 'A Lonely Evening at Sleeping Bear Dunes',
    'alt_description': 'calm body of water during nighttime',
    'urls': {
      'raw': 'https://images.unsplash.com/photo-1539229718633-256af3e4bb79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzMDczMX0',
      'full': 'https://images.unsplash.com/photo-1539229718633-256af3e4bb79?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjEzMDczMX0',
      'regular': 'https://images.unsplash.com/photo-1539229718633-256af3e4bb79?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEzMDczMX0',
      'small': 'https://images.unsplash.com/photo-1539229718633-256af3e4bb79?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjEzMDczMX0',
      'thumb': 'https://images.unsplash.com/photo-1539229718633-256af3e4bb79?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjEzMDczMX0'
    },
    'links': {
      'self': 'https://api.unsplash.com/photos/dXy2PDCBDcE',
      'html': 'https://unsplash.com/photos/dXy2PDCBDcE',
      'download': 'https://unsplash.com/photos/dXy2PDCBDcE/download',
      'download_location': 'https://api.unsplash.com/photos/dXy2PDCBDcE/download'
    },
    'categories': [

    ],
    'likes': 148,
    'liked_by_user': false,
    'current_user_collections': [

    ],
    'user': {
      'id': '5xh7HMNSwXs',
      'updated_at': '2020-03-26T12:19:59-04:00',
      'username': 'jacksonjost',
      'name': 'Jackson Jost',
      'first_name': 'Jackson',
      'last_name': 'Jost',
      'twitter_username': 'jxnjst',
      'portfolio_url': 'https://jacksonjost.com',
      'bio': 'Photographer & Visual Effects Supervisor.',
      'location': 'New York, US',
      'links': {
        'self': 'https://api.unsplash.com/users/jacksonjost',
        'html': 'https://unsplash.com/@jacksonjost',
        'photos': 'https://api.unsplash.com/users/jacksonjost/photos',
        'likes': 'https://api.unsplash.com/users/jacksonjost/likes',
        'portfolio': 'https://api.unsplash.com/users/jacksonjost/portfolio',
        'following': 'https://api.unsplash.com/users/jacksonjost/following',
        'followers': 'https://api.unsplash.com/users/jacksonjost/followers'
      },
      'profile_image': {
        'small': 'https://images.unsplash.com/profile-1539229567774-164e3fcfa583?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32',
        'medium': 'https://images.unsplash.com/profile-1539229567774-164e3fcfa583?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64',
        'large': 'https://images.unsplash.com/profile-1539229567774-164e3fcfa583?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128'
      },
      'instagram_username': 'jxnjst',
      'total_collections': 0,
      'total_likes': 70,
      'total_photos': 13,
      'accepted_tos': false
    },
    'exif': {
      'make': 'Canon',
      'model': 'Canon EOS 5D Mark III',
      'exposure_time': '1/500',
      'aperture': '2.8',
      'focal_length': '30.0',
      'iso': 1000
    },
    'location': {
      'title': 'Sleeping Bear Dunes, United States',
      'name': 'Sleeping Bear Dunes, United States',
      'city': null,
      'country': 'United States',
      'position': {
        'latitude': 44.8833286,
        'longitude': -86.0584273
      }
    },
    'views': 336874,
    'downloads': 2786
  };
}
