export default {
  datetimeFormats: {
    'fa-IR': {
      short: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      },
      long: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      },
      year: {
        year: 'numeric',
      },
      shortMonth: {
        month: 'numeric',
      },
      date: {
        year: 'numeric',
        month: '2-digit',
        day: 'numeric',
      },
      time: {
        hour: '2-digit',
        minute: '2-digit',
      },
    },
  },
  numberFormats: {
    'fa-IR': {
      currency: {
        style: 'decimal',
        currency: 'IRT',
        currencyDisplay: 'symbol', // نمایش علامت IRR
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      },
      plain: {
        style: 'decimal',
        minimumFractionDigits: 0,
      },
    },
  },
}
