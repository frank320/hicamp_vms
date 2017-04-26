/**
 * Created by frank on 2017/4/24.
 */
if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
  require('./dist/backend')
} else {
  require('./src/backend')
}