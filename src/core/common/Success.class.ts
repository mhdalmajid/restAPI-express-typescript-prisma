/**
 * @desc    This file contain Success and Error response for sending to client / user
 * @author  Huda Prasetyo
 * @since   2020
 */

/**
 * @desc    Send any success response
 *
 * @param   {string} message
 * @param   {object | array} results
 * @param   {number} statusCode
 */
export const success = (message, results, statusCode) => {
  return {
    message,
    error: false,
    code: statusCode,
    results,
  }
}
