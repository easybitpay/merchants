import moment from 'moment'
export default function useConvertDate() {
  /**
   * Convert Date with moment
   */
  const convertDate = (date, format) => {
    return moment.utc(date, 'YYYY-MM-DD hh:mm:ss').local().format(format)
  }

  /**
   * Convert Date with moment
   */
  const convertAddDate = (date, format, add) => {
    return moment(date, format).add(add, 'hour').format(format)
  }

  /**
   * Convert Date to from now
   */
  const convertDateFromNow = (date) => {
    return moment.utc(date, 'YYYY-MM-DD hh:mm:ss').local().fromNow()
  }

  /**
   * Convert Date to from now
   */
  const convertUnixFromNow = (date) => {
    return moment.unix(date).local().fromNow()
  }

  return {
    convertDate,
    convertAddDate,
    convertDateFromNow,
    convertUnixFromNow,
  }
}
