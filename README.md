# txt.discord.website
This site is used to view `.txt` files that have been uploaded to Discord.
The site is static; the data loading and formatting is performed clientside.
Deleting the original file from Discord will also prevent loading it with this site.

## Example
Link to a txt file uploaded to Discord:
> https://cdn.discordapp.com/attachments/147698382092238848/506154212124786689/example.txt

Take the relevant substring (channel id, attachment id, and attachment name):
> 147698382092238848/506154212124786689/example 

Add as a query parameter:
> https://txt.discord.website?txt=147698382092238848/506154212124786689/example

For raw (non-formatted) output, append `&raw=true`:
> https://txt.discord.website?txt=147698382092238848/506154212124786689/example&raw=true

## Logging format
Additional formatting will occur for lines formatted in the following way:
```
[Timestamp] Username Up To 70 Chars (optional Discord ID) : Content
```
Ex:
```
[October 29, 2018 at 5:37 PM] jagrosh#4824 (123456789012345678) : Hello there
```
