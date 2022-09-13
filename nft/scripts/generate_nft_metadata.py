import os
import requests
import json
import datetime
import calendar

monthly = [('2022-01-01 00:00:00', '2022-0')]
thisYear = datetime.date.today().year
thisMonth = datetime.date.today().month


def init_dir():
    try:
        current_dir = '.' + os.sep + 'files'
        if not os.path.isdir(current_dir):
            os.makedirs(current_dir)
    except Exception as e:
        print(e)


def save(type: int, year: int, month: int, isAllTime: bool, startTime: str, endTime: str):
    fileName = '{}_{}_{}'.format(
        'Monthly' if type == 0 else 'Quarterly', year, month)
    resp = requests.get(
        'https://api-go.toucanleader.xyz/service/main/v1/getLeaderboard?type=nct&start_time={}&end_time={}'.format(startTime, endTime))
    print(fileName+"    "+startTime+" "+endTime)
    with open('.' + os.sep + 'files' + os.sep + fileName + '.csv', 'a+') as f:
        for index, item in enumerate(json.loads(resp.content)['list'], 1):
            f.write('{},{},{},{},{},{}\n'.format(
                type, year, month, isAllTime, index, item['wallet_pub']))


def main():
    init_dir()
    # monthly
    for month in range(1, thisMonth):
        startTime = datetime.date(
            thisYear, month, 1).strftime('%Y-%m-%d %H:%M:%S')
        _, days = calendar.monthrange(thisYear, month)
        endTime = datetime.datetime(
            thisYear, month, days, 23, 59, 59).strftime('%Y-%m-%d %H:%M:%S')
        save(0, thisYear, month, False, startTime, endTime)

    # quarterly
    for quarter in range(1, (thisMonth-1)//3+1):
        startTime = datetime.date(
            thisYear, (quarter-1)*3+1, 1).strftime('%Y-%m-%d %H:%M:%S')
        _, days = calendar.monthrange(thisYear, quarter*3)
        endTime = datetime.datetime(
            thisYear, quarter*3, days, 23, 59, 59).strftime('%Y-%m-%d %H:%M:%S')
        save(1, thisYear, quarter, False, startTime, endTime)


main()
