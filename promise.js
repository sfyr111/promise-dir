// http://www.mattgreer.org/articles/promises-in-wicked-detail/

function Promise(fn) {
  var value,
      state = 'pending',
      deferred = null // 待执行

  function resolve(newValue) {
    try {
      // 如果是个Promise 或者thenable
      if (newValue && typeof newValue.then === 'function') {
        newValue.then(resolve, reject)
        return
      }
      state = 'resolved'
      value = newValue

      deferred && handle(deferred)
    } catch (e) {
      reject(e)
    }
  }

  function reject(reason) {
    state = 'rejected'
    value = reason

    deferred && handle(deferred)
  }

  function handle(handler) {
    if (state === 'pending') {
      deferred = handler
      return
    }

    var handlerCallback

    handlerCallback = state === 'resolved' ? handler.onResolved : handler.onRejected

    if (!handlerCallback) {
      state === 'resolved'
        ? handler.resolve(value)
        : handler.reject(value)
      return
    }

    var ret
    try {
      ret = handlerCallback(value)
      handler.resolve(ret)
    } catch (e) {
      handler.reject(e)
    }
  }

  this.then = function(onResolved, onRejected) {
    return new Promise(function (resolve, reject) {
      handle({
        onResolved: onResolved,
        onRejected: onRejected,
        resolve: resolve,
        reject: reject
      })
    })
  }

  fn(resolve, reject)
}

/**
 * @feature 正确处理
 * @returns {Promise}
 */
// function getSuccess() {
//   return new Promise(function(resolve, reject) {
//     setTimeout(function(resp) {
//       resp = { status: 200, data: 'ok', error: null }
//       if (resp.error) {
//         reject(resp.error)
//       } else {
//         resolve(resp.data)
//       }
//
//     }, 800)
//   })
// }
//
// getSuccess().then(function(data) {
//   console.log(data)
// }, function(error) {
//   console.log(error)
// })

/**
 * @feature 错误处理
 * @returns {Promise}
 */
// function getError() {
//   return new Promise(function(resolve, reject) {
//     setTimeout(function(resp) {
//       resp = { status: 404, data: 'error', error: 'not found!!' }
//       if (resp.error) {
//         reject(resp.error)
//       } else {
//         resolve(resp.data)
//       }
//     })
//   })
// }
//
// getError().then(function(data) {
//   console.log(data)
// }, function(error) {
//   console.log(error)
// })

/**
 * 链式调用
 */
// new Promise ((resolve, reject) => {
//   setTimeout(() => {
//     resolve(1)
//   }, 500)
// }).then((val) => {
//   console.log(val)
//   return new Promise ((resolve, reject) => {
//     setTimeout(() => {
//       resolve(2)
//     }, 500)
//   })
// }).then((val) => {
//   console.log(val)
//   return new Promise ((resolve, reject) => {
//     setTimeout(() => {
//       resolve(3)
//     }, 500)
//   })
// }).then((val) => {
//   console.log(val)
//   return new Promise ((resolve, reject) => {
//     setTimeout(() => {
//       resolve(5)
//     }, 500)
//   })
// })