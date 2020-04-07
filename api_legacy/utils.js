import * as moment from 'moment';
export function reviveJsonValue(key, val) {
    console.debug("Revining JSON value", val);
    if (!val.hasOwnProperty('indexOf') || val.indexOf('-') < 0) {
        return val;
    }
    const timestamp = moment(val, moment.ISO_8601, true);
    if (timestamp.isValid()) {
        return timestamp.toDate();
    }
    return val;
}
export function getEventNamesForEndpoint(endpointName) {
    return { request: `_api-${endpointName}-request`, response: `_api-${endpointName}-response` };
}
export function getEventNamesForWindowEndpoint(endpointName) {
    return { request: `_open-${endpointName}-request`, response: `_open-${endpointName}-response` };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBpX2xlZ2FjeS91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUdqQyxNQUFNLFVBQVUsZUFBZSxDQUFDLEdBQVcsRUFBRSxHQUFRO0lBQ25ELE9BQU8sQ0FBQyxLQUFLLENBQUMscUJBQXFCLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDMUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDMUQsT0FBTyxHQUFHLENBQUM7S0FDWjtJQUNELE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNyRCxJQUFJLFNBQVMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtRQUN2QixPQUFPLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUMzQjtJQUNELE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQU1ELE1BQU0sVUFBVSx3QkFBd0IsQ0FBQyxZQUFvQjtJQUMzRCxPQUFPLEVBQUUsT0FBTyxFQUFFLFFBQVEsWUFBWSxVQUFVLEVBQUUsUUFBUSxFQUFFLFFBQVEsWUFBWSxXQUFXLEVBQUUsQ0FBQztBQUNoRyxDQUFDO0FBR0QsTUFBTSxVQUFVLDhCQUE4QixDQUFDLFlBQW9CO0lBQ2pFLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxZQUFZLFVBQVUsRUFBRSxRQUFRLEVBQUUsU0FBUyxZQUFZLFdBQVcsRUFBRSxDQUFDO0FBQ2xHLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBtb21lbnQgZnJvbSAnbW9tZW50JztcblxuXG5leHBvcnQgZnVuY3Rpb24gcmV2aXZlSnNvblZhbHVlKGtleTogc3RyaW5nLCB2YWw6IGFueSkge1xuICBjb25zb2xlLmRlYnVnKFwiUmV2aW5pbmcgSlNPTiB2YWx1ZVwiLCB2YWwpO1xuICBpZiAoIXZhbC5oYXNPd25Qcm9wZXJ0eSgnaW5kZXhPZicpIHx8IHZhbC5pbmRleE9mKCctJykgPCAwKSB7XG4gICAgcmV0dXJuIHZhbDtcbiAgfVxuICBjb25zdCB0aW1lc3RhbXAgPSBtb21lbnQodmFsLCBtb21lbnQuSVNPXzg2MDEsIHRydWUpO1xuICBpZiAodGltZXN0YW1wLmlzVmFsaWQoKSkge1xuICAgIHJldHVybiB0aW1lc3RhbXAudG9EYXRlKCk7XG4gIH1cbiAgcmV0dXJuIHZhbDtcbn1cblxuXG5leHBvcnQgdHlwZSBBUElSZXNwb25zZTxPPiA9IHsgZXJyb3JzOiBzdHJpbmdbXSwgcmVzdWx0OiBPIHwgdW5kZWZpbmVkIH07XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEV2ZW50TmFtZXNGb3JFbmRwb2ludChlbmRwb2ludE5hbWU6IHN0cmluZyk6IHsgcmVxdWVzdDogc3RyaW5nLCByZXNwb25zZTogc3RyaW5nIH0ge1xuICByZXR1cm4geyByZXF1ZXN0OiBgX2FwaS0ke2VuZHBvaW50TmFtZX0tcmVxdWVzdGAsIHJlc3BvbnNlOiBgX2FwaS0ke2VuZHBvaW50TmFtZX0tcmVzcG9uc2VgIH07XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEV2ZW50TmFtZXNGb3JXaW5kb3dFbmRwb2ludChlbmRwb2ludE5hbWU6IHN0cmluZyk6IHsgcmVxdWVzdDogc3RyaW5nLCByZXNwb25zZTogc3RyaW5nIH0ge1xuICByZXR1cm4geyByZXF1ZXN0OiBgX29wZW4tJHtlbmRwb2ludE5hbWV9LXJlcXVlc3RgLCByZXNwb25zZTogYF9vcGVuLSR7ZW5kcG9pbnROYW1lfS1yZXNwb25zZWAgfTtcbn1cbiJdfQ==