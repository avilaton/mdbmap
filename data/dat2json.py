#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
#	   untitled.py
#	   
#	   Copyright 2012 Gaston Avila <avila.gas@gmail.com>
#	   
#	   This program is free software; you can redistribute it and/or modify
#	   it under the terms of the GNU General Public License as published by
#	   the Free Software Foundation; either version 2 of the License, or
#	   (at your option) any later version.
#	   
#	   This program is distributed in the hope that it will be useful,
#	   but WITHOUT ANY WARRANTY; without even the implied warranty of
#	   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#	   GNU General Public License for more details.
#	   
#	   You should have received a copy of the GNU General Public License
#	   along with this program; if not, write to the Free Software
#	   Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
#	   MA 02110-1301, USA.

import json
import csv
import datetime as dt
	
def csv2jsonMat(infile):
	inList = []
	reader = csv.DictReader(infile)
	for row in reader:
		lat = -(float(row['LatDeg'])+1/60.0*float(row['LatMin']+'.'+row['LatMil']))
		lon = -(float(row['LongDeg'])+1/60.0*float(row['LongMin']+'.'+row['LongMil']))
		#tstamp = dt.datetime.strptime(dic['Date']+'-'+dic['Heure']+'.'+dic['Mil'],'%d/%m/%y-%H:%M:%S.%f')
		#gpxtfmt = "%Y-%m-%dT%H:%M:%S.%fZ"
		#gpxtstamp = dt.datetime.strftime(tstamp,gpxtfmt)
		#print tstamp, gpxtstamp
		row.update({'lat':lat,'lon':lon, 'radius':float(row['RadiusWpt'])})
		if row['LatDeg'] == '0':
			continue
		inList.append(row)
	jsonOut = json.dumps(inList)
	return jsonOut

def writeGeoJson(inputlist):
	reader = csv.DictReader(inputlist)
	outDict = {"type": "FeatureCollection","features":[]}
	for row in reader:
		lat = -(float(row['LatDeg'])+1/60.0*float(row['LatMin']+'.'+row['LatMil']))
		lon = -(float(row['LongDeg'])+1/60.0*float(row['LongMin']+'.'+row['LongMil']))
		feature = { "type": "Feature",
					"geometry": {"type": "Point", 
						"coordinates": [lon, lat]},
					"properties": row
					}
		outDict['features'].append(feature)
	jsonOut = json.dumps(outDict,indent=2)
	return jsonOut

def main(filename):
	infile = open(filename,'r')
	jsonData = csv2jsonMat(infile)
	infile.close()
	file = open('wpt.json','w')
	file.write(jsonData)
	file.close()
	
	infile = open(filename,'r')
	wptGeoJson = writeGeoJson(infile)
	infile.close()
	file = open('wptGeoJson.json','w')
	file.write(wptGeoJson)
	file.close()
	
if __name__ == '__main__':
	filename = 'men.txt'
	main(filename)




