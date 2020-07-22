import * as moment from 'moment';
export function reviveJsonValue(key, val) {
    if (!val || val.indexOf === undefined || val.indexOf('-') < 0) {
        return val;
    }
    const timestamp = moment(val, moment.ISO_8601, true);
    if (timestamp.isValid()) {
        return timestamp.toDate();
    }
    return val;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaXBjL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBR2pDLE1BQU0sVUFBVSxlQUFlLENBQUMsR0FBVyxFQUFFLEdBQVE7SUFDbkQsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxLQUFLLFNBQVMsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUM3RCxPQUFPLEdBQUcsQ0FBQztLQUNaO0lBQ0QsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3JELElBQUksU0FBUyxDQUFDLE9BQU8sRUFBRSxFQUFFO1FBQ3ZCLE9BQU8sU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQzNCO0lBQ0QsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbW9tZW50IGZyb20gJ21vbWVudCc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHJldml2ZUpzb25WYWx1ZShrZXk6IHN0cmluZywgdmFsOiBhbnkpIHtcbiAgaWYgKCF2YWwgfHwgdmFsLmluZGV4T2YgPT09IHVuZGVmaW5lZCB8fCB2YWwuaW5kZXhPZignLScpIDwgMCkge1xuICAgIHJldHVybiB2YWw7XG4gIH1cbiAgY29uc3QgdGltZXN0YW1wID0gbW9tZW50KHZhbCwgbW9tZW50LklTT184NjAxLCB0cnVlKTtcbiAgaWYgKHRpbWVzdGFtcC5pc1ZhbGlkKCkpIHtcbiAgICByZXR1cm4gdGltZXN0YW1wLnRvRGF0ZSgpO1xuICB9XG4gIHJldHVybiB2YWw7XG59XG4iXX0=