<%
'******************************************************************************************
'***	DictionaryObject.inc
'***
'***	This file contains code to manipulate dictionary objects for browser-based
'***	applications.  The functions here provide a simpler method for creating a 
'***	dictionary object.  You may use either the request string passed to a ASP file 
'***	via the post method, or pass in a manually built string with the proper 
'***	key/value pairs.
'******************************************************************************************
%>

<%
'******************************************************************************************
'***	Name		URLDecode
'***	Parameters	strDecode		string to decode
'***
'***	Return		Fully decoded string
'******************************************************************************************
Function URLDecode(strDecode)

	dim strIn
	dim strOut
	dim iPos
	dim strLeft
	dim strRight
	dim iLoop
	
	strIn = strDecode
	strOut = ""
	
	iPos = instr(strIn, "+")
	do while (iPos)
		strLeft = ""
		strRight = ""

		if (iPos > 1) then 
			strLeft = left(strIn, iPos - 1)
		end if
		
		if (iPos < len(strIn)) then 
			strRight = mid(strIn, iPos + 1)
		end if
		
		strIn = strLeft & " " & strRight
		
		iPos = instr(strIn, "+")
		iLoop = iLoop + 1
	loop
	
	iPos = instr(strIn, "%")
	do while (iPos)
		if (iPos > 1) then 
			strOut = strOut & left(strIn, iPos - 1)
		end if
		
		strOut = strOut & chr(cint("&H" & mid(strIn, iPos + 1, 2)))
		
		if (iPos > (len(strIn) - 3)) then
			strIn = ""
		else
			strIn = mid(strIn, iPos + 3)
		end if
		
		iPos = instr(strIn, "%")
	loop
	
	URLDecode = strOut + strIn
	
end Function

'******************************************************************************************
'***	Name		BuildDictionaryFromString
'***	Parameters	strQuery					string to decode
'***	
'***	Return		Dictionary with key/value pairs from strQuery as items
'******************************************************************************************

Function BuildDictionaryFromString(strQuery)
	
	dim objResult
	dim iStep
	dim strKey
	dim strValue
	dim strNVPair
	dim iEquals
	
	set objResult = CreateObject("Scripting.Dictionary")

	iStep = instr(strQuery, "&")
	do while iStep
		strKey = ""
		strValue = ""
		strNVPair = left(strQuery, iStep - 1)
		strQuery = mid(strQuery, iStep + 1)
		
		iEquals = instr(strNVPair, "=")
		if (iEquals > 1) then 
			strKey = URLDecode(left(strNVPair, iEquals - 1))			
		end if
		
		if (iEquals < len(strNVPair)) then
			strValue = URLDecode(mid(strNVPair, iEquals + 1))
		end if
	
		if (objResult.Exists(strKey)) then	
			objResult.Item(strKey) = strValue
		else
			objResult.Add strKey, strValue
		end if
			
		iStep = instr(strQuery, "&")
	loop
	
	strKey = ""
	strValue = ""
	iEquals = instr(strQuery, "=")
	
	if (iEquals > 1) then
		strKey = URLDecode(left(strQuery, iEquals - 1))
	end if 
	
	if (iEquals < len(strQuery)) then
		strValue = URLDecode(mid(strQuery, iEquals + 1))		
	end if
	
	if (objResult.Exists(strKey)) then
		objResult.Item(strKey) = strValue
	else	
		objResult.Add strKey, strValue
	end if

	set BuildDictionaryFromString = objResult

end Function

'******************************************************************************************
'***	Name		BuildDictionaryFromRequest
'***	Parameters	objRequest					Request object to decode
'***	
'***	Return		Dictionary with key/value pairs from the Request object as items
'******************************************************************************************

Function BuildDictionaryFromRequest(objRequest)
	
	dim strQuery
	dim item
	dim iLoop
	
	strQuery = ""
	
	for each item in objRequest.Form
		if (objRequest.Form(item).Count) then
			if (objRequest.Form(item).Count <> 1) then				
				for iLoop = 1 to objRequest.Form(item).Count				
					strQuery = strQuery & item & "_" & iLoop & "=" & objRequest.Form(item)(iLoop) & "&"
				next
			else
				strQuery = strQuery & item & "=" & objRequest.Form(item)(1) & "&"
			end if			
		else			
			strQuery = strQuery & item & "=" & objRequest.Form(item) & "&"
		end if
	next

	set BuildDictionaryFromRequest = BuildDictionaryFromString(strQuery)

end Function

Function GetDictionaryValue(strKey, objDictionary)
	dim strReturn
	strReturn = ""
	if (objDictionary.Exists(strKey)) then
		if (objDictionary.Item(strKey) <> "") then
			strReturn = objDictionary.Item(strKey)
		end if
	end if
	
	GetDictionaryValue = strReturn

end Function

'******************************************************************************************
%>

