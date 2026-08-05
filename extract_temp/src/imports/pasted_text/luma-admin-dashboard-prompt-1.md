LUMA COSMETICS — ADMIN DASHBOARD DESIGN MASTER PROMPT
ROLE

Act as a senior product designer, operations UX designer, e-commerce systems designer, and visual UI designer.

Design a complete LUMA COSMETICS Admin Dashboard for managing the LUMA cosmetics storefront.

This is NOT the customer-facing website.

This is the internal business application used by the store owner/operator to:

manage products
manage inventory
manage homepage merchandising
manage campaigns
receive and process orders
manually call customers
confirm/reject orders
prepare confirmed orders
send orders to delivery agencies
monitor delivery
monitor sales
monitor confirmation performance
monitor product performance
manage multiple delivery agencies
view operational statistics

The dashboard must feel like a serious commercial operations tool, not a generic AI-generated SaaS dashboard.

The customer-facing LUMA website has a sophisticated beauty/e-commerce aesthetic.

The admin should share the LUMA brand language but prioritize:

speed → clarity → information → operational efficiency

over decorative beauty.

1. CORE DESIGN PHILOSOPHY

The admin should combine:

Shopify-like practicality

with

modern dashboard aesthetics

and

operations-first order management.

The result should feel like a system a real cosmetics business could use every day.

Do NOT make it look like:

a generic SaaS template
a crypto dashboard
a finance dashboard
a developer dashboard
a generic AI dashboard
an overly colorful analytics application

It should feel specifically designed for LUMA's cosmetics business and order-confirmation workflow.

2. INFORMATION DENSITY

Use adaptive information density.

Dashboard

Medium density.

Enough information to understand the business quickly without feeling crowded.

Orders

High density.

The operator needs to process many orders efficiently.

Order detail

High information density, but organized into clear sections.

Product editor

More spacious.

Product images, descriptions and product information need room.

Analytics

Medium density.

Charts and key metrics should be immediately understandable.

Settings

Clean and simple.

3. ADMIN NAVIGATION

Create a persistent desktop sidebar.

Primary navigation:

Dashboard
Orders
Products
Inventory
Campaigns
Analytics
Delivery
Settings

Do NOT create a dedicated Customers section.

Customer information belongs to the order system.

The sidebar should show useful badges where appropriate.

Example:

Orders 12

where 12 represents orders requiring attention.

4. DASHBOARD

The dashboard should answer:

"What is happening in my business right now?"

within seconds.

Create:

TOP SUMMARY

Important metrics:

Orders Today
Pending Confirmation
Confirmed Orders
Delivered
Revenue
Confirmation Rate

Use meaningful comparisons against the previous period where data exists.

Do not use fake statistics.

For the Figma prototype, clearly identify demonstration data as sample/demo data.

5. ORDER OPERATIONS WIDGET

This is one of the most important dashboard sections.

Show:

Orders requiring attention

For example:

#1048
New order
4,590 DA
Constantine
3 minutes ago

#1047
No answer — attempt 1
6,200 DA
Algiers
21 minutes ago

#1046
Confirmed — ready for delivery
3,800 DA
Oran

The operator should be able to open an order immediately.

6. ORDER STATUS SYSTEM

Use these primary states:

NEW

Order has just arrived.

↓

CALLING

Customer is currently being contacted / order is being processed for confirmation.

↓

CONFIRMED

Customer confirmed the order.

↓

PREPARING

Order is being prepared.

↓

READY FOR DELIVERY

Order is ready to be handed to a delivery agency.

↓

SENT TO DELIVERY

Delivery agency has received the shipment.

↓

PICKED UP

Agency has picked up the order.

↓

OUT FOR DELIVERY

Courier is delivering.

↓

DELIVERED

Successfully delivered.

Alternative/failure states:

Rejected
No Answer
Cancelled
Failed Delivery
Returned

The design should make status visually obvious without relying exclusively on color.

7. FOLLOW-UP

When an order receives a No Answer outcome:

Allow the operator to record the call attempt.

Example:

No Answer
Attempt 1

The system should allow another attempt later.

Create a clear Follow Up state/list without making the entire navigation complicated.

Show:

number of attempts
last attempt
next follow-up if applicable

Do not create an overly complicated CRM system.

8. ORDERS PAGE

This is the operational heart of the admin.

Create a professional order-management interface.

Use a hybrid approach:

Status tabs

Example:

All

New

Calling

Follow Up

Confirmed

Preparing

Delivery

Completed

Cancelled

with counts where useful.

Below the tabs, provide a dense order table/list.

Columns:

Order ID
Customer
Phone
Wilaya
Items
Total
Status
Time
Delivery
Actions

Make the table highly scannable.

9. ORDER SEARCH

Search orders by:

Order ID
Customer name
Phone number
Wilaya
Product
Delivery tracking number

Provide filters for:

status
date
Wilaya
delivery agency
order value

Allow custom date ranges.

Do not make filtering visually complicated.

10. ORDER DETAIL

Clicking an order should open a dedicated order page or a large detailed panel, depending on what the design communicates best.

The most important action should be:

CALL CUSTOMER

This should be visually prominent.

The operator should not have to hunt for the phone number or call action.

11. CUSTOMER INFORMATION

Display:

Customer

Name

Phone

Wilaya

Commune

Address

Delivery notes

Do not create a separate customer-management system.

Customer information is contextual to the order.

12. ORDER INFORMATION

Display:

Order ID
Date/time
Products
Product images
Variants
Shades
Quantities
Unit prices
Subtotal
Delivery fee
Total

Use strong visual hierarchy for the final order total.

13. CALL WORKFLOW

Make the call action extremely obvious.

Example:

📞 Call +213 XX XX XX XX

After the call, display:

What happened?
Confirmed
Rejected
No Answer
Phone Unavailable
Wrong Number
Customer Requested Callback
Address Correction Needed

Allow an internal note.

Example:

"Customer asked delivery after 17:00."

Do not make internal notes visible to customers.

14. ORDER TIMELINE

Every order should have an operational timeline.

Example:

14:32
Order received

14:35
Called customer

14:36
Customer confirmed

14:40
Order prepared

14:48
Sent to delivery agency

16:20
Picked up

This should make the history of an order immediately understandable.

15. EDITING CONFIRMED ORDERS

The admin must be able to modify:

products
quantities
address
Wilaya
Commune
delivery information

after speaking with the customer.

The interface should make modifications clear.

For important changes, show a confirmation step.

16. CONFIRMATION → DELIVERY FLOW

After customer confirmation:

Confirm Order

↓

Review Order

↓

Choose Delivery Agency

↓

Confirm Delivery Information

↓

Send to Delivery

The design should make this workflow extremely clear.

Do not force unnecessary screens.

17. DELIVERY MANAGEMENT

Create a dedicated Delivery section.

The business may eventually use multiple Algerian delivery companies.

Design the system around multiple providers from the beginning.

Example:

Delivery Overview
Agency	Pending	In Transit	Delivered	Failed	Returned

Possible providers should be represented as configurable entities.

Do NOT assume specific providers are currently connected.

Use neutral sample/demo agency names where necessary.

18. DELIVERY AGENCY DETAILS

Create an agency detail/configuration view containing:

agency name
active/inactive
API connection status
supported Wilayas
delivery pricing configuration
orders currently with agency
delivered orders
failed orders
returned orders

The architecture should clearly accommodate future APIs.

19. DELIVERY API PREPARATION

The design should support future integration where:

The admin can eventually:

calculate delivery fee
select agency
create delivery order
receive tracking number
track shipment
receive status updates
identify failed deliveries
identify returned shipments

Do NOT pretend these APIs are already connected.

Use appropriate demo states.

20. PRODUCTS

Create a complete product-management section.

The admin must be able to:

create product
edit product
hide product
publish product
mark out of stock
archive product

Product list should show:

image
name
brand
category
price
stock
status
best seller
new
featured
21. PRODUCT EDITOR

Create a professional product editor.

Sections:

Basic Information
Product name
Brand
Category
Subcategory
Description
Pricing
Price
Original price
Discount
Inventory
Stock quantity
Low-stock threshold
Availability
Product Media

Support:

Images

Multiple images.

Allow:

upload
preview
reorder
choose primary image
delete
VIDEO

The product system must also support video media.

Allow product videos to be uploaded/associated with a product.

Use cases:

product demonstration
texture demonstration
swatches
campaign clips
beauty tutorials
product presentation

Videos should be treated as first-class media rather than an afterthought.

Design a media gallery that can contain both:

Images + Videos

22. PRODUCT INFORMATION

Support fields for:

benefits
suitable for
ingredients
how to use
warnings
size
variants
shades

Only show relevant fields on the storefront.

23. PRODUCT FLAGS

Allow toggling:

Best Seller
New Arrival
Featured
On Sale
Hidden
Out of Stock

These flags should control corresponding storefront merchandising where appropriate.

24. INVENTORY

Create a dedicated inventory view.

Show:

product
current stock
status
low-stock threshold
last updated

Statuses:

In Stock
Low Stock
Out of Stock

Make low-stock items easy to identify.

Do not use fake inventory values in production.

25. CAMPAIGNS

Create a campaign management section.

Campaigns can group products.

Example:

Summer Beauty

Products:

Product A
Product B
Product C

Allow:

campaign name
description
campaign image
campaign video
start/end date
selected products
active/inactive

Campaigns should be useful for the storefront's:

Offers
Trending
Collections
Seasonal promotions
26. HOMEPAGE MERCHANDISING

Allow the admin to control basic homepage merchandising.

The admin should be able to:

choose featured products
choose best sellers
choose promotional products
choose active campaigns
enable/disable homepage sections
control basic ordering/priority

Do NOT build a complex drag-and-drop website builder.

The purpose is simple merchandising control.

27. ANALYTICS

Create a complete analytics section.

It should cover:

SALES
Gross order value
Confirmed value
Delivered value
Returned value
Cancelled value
Average order value
ORDERS
Total orders
Confirmed
Rejected
No Answer
Cancelled
Delivered
Failed
Returned
CONFIRMATION
Confirmation rate
Rejection rate
No-answer rate
Average confirmation time
DELIVERY
Delivery success rate
Failed delivery rate
Return rate
Average delivery time where available
PRODUCTS
Best sellers
Top categories
Most ordered products
Low-stock products
28. REVENUE DISTINCTION

Do NOT treat every incoming order as revenue.

Clearly distinguish:

Gross Order Value

Value of incoming orders.

Confirmed Value

Orders confirmed by customers.

Delivered Revenue

Successfully delivered orders.

Returned / Cancelled Value

Orders that did not result in successful delivery.

This distinction is critical for meaningful business analytics.

29. ANALYTICS TIME PERIOD

Default:

Last 30 Days

Allow:

Today
7 days
30 days
custom date range

Charts should be readable and useful.

Do not fill the dashboard with charts simply because charts look impressive.

Every visualization must answer a business question.

30. NOTIFICATIONS

Create a notification system.

When a new order arrives:

dashboard badge updates
orders count updates
browser notification can appear

Use sound only where appropriate and allow it to be controlled.

Do not create intrusive notifications.

31. SETTINGS

Create a settings section for:

Store
Store name
Logo
Contact information
Contact Channels
WhatsApp
Instagram
Messenger
Delivery
delivery providers
provider configuration
future API settings
Notifications
browser notifications
sound
Language
French
Arabic
English

Do not create unnecessary settings.

32. LANGUAGE SUPPORT

The admin should support:

French
Arabic
English

Arabic must properly support RTL.

The admin layout should remain usable in RTL.

Do not simply mirror everything mechanically.

Check:

tables
sidebar
charts
forms
order details
buttons
icons
drawers
filters
33. RESPONSIVE ADMIN

Desktop is the primary environment because this is an operational tool.

However, it must remain usable on tablets and mobile.

Mobile should prioritize:

incoming order alerts
order list
order detail
customer phone
call action
order confirmation
delivery status

Product management and complex analytics can be more desktop-oriented.

Do not attempt to cram a giant desktop table onto a phone.

34. VISUAL LANGUAGE

The admin should share LUMA's brand identity without looking like the customer storefront.

Use the same underlying:

typography
brand accent
visual quality
icon language
spacing philosophy

But use a more functional UI.

The customer website says:

Beauty

The admin says:

Control

35. COLOR

Use a sophisticated neutral foundation.

Use the LUMA accent color for:

primary actions
selected states
important highlights
active navigation
positive actions

Status colors may be used where necessary:

success
warning
error
neutral

Do not make the entire dashboard colorful.

36. TABLES

Tables are extremely important.

They must be:

readable
sortable
filterable
responsive
scannable

Use:

sticky headers where appropriate
clear column hierarchy
row hover
status badges
contextual actions

Avoid overly decorative tables.

37. ORDER PRIORITY

The admin should immediately understand:

Which order needs my attention right now?

Use:

time waiting
status
follow-up state
call attempts

Do not rely solely on red/yellow/green colors.

Example:

New · 4 min ago

Follow Up · Attempt 2 · 42 min

Confirmed · Ready for Delivery

38. EMPTY STATES

Design proper empty states for:

no orders
no pending orders
no products
no campaigns
no low-stock products
no analytics data
no delivery shipments

Do not show blank white pages.

39. LOADING STATES

Design:

skeleton loaders
loading buttons
loading tables
image loading
analytics loading

Do not freeze the interface without feedback.

40. ERROR STATES

Design useful error states for:

failed order submission
failed delivery API
failed product upload
failed image upload
failed video upload
failed data loading

Errors should tell the operator what happened and what they can do.

41. VIDEO SUPPORT

Video should be treated as an important part of the future LUMA marketing system.

Support videos in:

Products

Product demonstration videos.

Campaigns

Campaign promotional videos.

Homepage

Optional campaign/hero video.

Product media gallery

Mixed image/video gallery.

However:

Do not make videos autoplay everywhere.

Use performance-conscious behavior.

The design should work perfectly when no video exists.

42. NO CUSTOMERS PAGE

Do NOT build a separate CRM/customer management section in this version.

Customer information should exist within:

Orders

and remain accessible from order history.

The architecture can later be extended into a customer system if necessary.

43. SECURITY

The admin is private.

Design appropriate authentication screens:

Login
Email/username
Password
Sign in
Forgot password

Do not design public access to the admin.

Initially assume a single administrator.

However, keep the architecture extensible for future roles without building a complex permissions UI now.

44. ADMIN LOGIN

The login screen should feel like LUMA but much simpler than the storefront.

Use:

LUMA logo
clean background
authentication form
clear error states
password visibility control

No unnecessary marketing content.

45. DO NOT MAKE IT LOOK AI-GENERATED

This is extremely important.

Do NOT use:

excessive gradients
purple AI aesthetics
giant rounded cards
glassmorphism everywhere
floating decorative blobs
random illustrations
excessive emojis
fake statistics
meaningless charts
unnecessary animations
generic SaaS dashboard templates
excessive whitespace
enormous headings
random colorful icons
fake activity
fake customers
fake revenue
fake orders

The interface must feel like a real internal business application.

46. NO FAKE DATA CLAIMS

Demo data may be used to demonstrate the UI.

But clearly structure it as sample/demo data.

Do not create fake:

customer testimonials
business statistics
real delivery API statuses
real order numbers implying actual customers
real reviews

The production system must obtain real data from the backend.

47. DESIGN SYSTEM

Create reusable components for:

Layout
Sidebar
Header
Mobile navigation
Orders
Order table
Order row
Status badge
Order detail
Timeline
Call action
Confirmation action
Delivery action
Products
Product table
Product card
Product editor
Media uploader
Image gallery
Video gallery
Inventory indicator
Analytics
Metric cards
Charts
Date selector
Filters
Campaigns
Campaign card
Campaign editor
Product selector
Forms
Input
Select
Multi-select
Toggle
Upload
Modal
Drawer
Confirmation dialog
48. COMPLETE PAGE INVENTORY

Generate the complete admin design, not just the dashboard.

Create:

Authentication
Login
Authentication error state
Dashboard
Dashboard
Dashboard notification state
Orders
All Orders
New Orders
Order Detail
Order Confirmation
Follow-Up Orders
Delivery Orders
Cancelled/Failed Orders
Products
Products
Add Product
Edit Product
Product Media
Inventory
Campaigns
Campaigns
Create Campaign
Edit Campaign
Analytics
Analytics Overview
Sales Analytics
Order/Confirmation Analytics
Delivery Analytics
Product Analytics
Delivery
Delivery Overview
Delivery Agency Detail
Delivery Configuration
Settings
General Settings
Contact Settings
Delivery Settings
Notification Settings
Language Settings

Also create the relevant:

empty states
loading states
error states
modal states
confirmation dialogs
mobile variants
49. MOST IMPORTANT SCREEN

The Order Detail / Confirmation screen is the highest-priority screen in the entire admin.

It must answer immediately:

WHO?

Customer information.

WHAT?

Products and quantities.

HOW MUCH?

Total.

WHERE?

Wilaya, commune, address.

CALL?

Large obvious call action.

RESULT?

Confirmation outcome.

THEN WHAT?

Prepare → choose delivery agency → send.

The operator should be able to process an order extremely quickly.

50. FINAL DESIGN GOAL

Do not design an admin dashboard that merely looks impressive.

Design an operational tool that makes running LUMA easier.

The ideal workflow should feel like:

New order arrives

↓

Operator sees it immediately

↓

Opens order

↓

Sees customer + products + address + total

↓

Calls customer

↓

Records result

↓

If confirmed:

Reviews order

↓

Chooses delivery agency

↓

Sends order to delivery

↓

Tracks delivery

↓

Order becomes delivered

The dashboard should make this workflow fast, obvious and difficult to mess up.

FINAL INSTRUCTION TO FIGMA MAKE

Generate the complete LUMA COSMETICS Admin Dashboard design system and all major screens, not just a dashboard mockup.

Prioritize operational usability over decorative design.

Use the existing LUMA customer-facing brand as the visual foundation, but create a distinct professional admin experience.

The final result should feel like a combination of:

Shopify Admin
+
modern e-commerce operations software
+
delivery/order management system
+
LUMA's own visual identity

while remaining original and specifically designed for this business.

Do not omit screens because they are difficult.

Do not collapse the entire application into one dashboard.

Show the complete workflow from:

ORDER RECEIVED → CALL → CONFIRM → PREPARE → DELIVERY → DELIVERED

and the complete product workflow from:

CREATE PRODUCT → MEDIA → PRICING → INVENTORY → PUBLISH → FEATURE/CAMPAIGN

The design must be ready to hand to a developer/agent for implementation.