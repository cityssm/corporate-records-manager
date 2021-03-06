create schema CR
GO


create table CR.Users (
	userName varchar(30) primary key not null,
	fullName nvarchar(200),
	isActive bit not null default 0,
	canViewAll bit not null default 0,
	canUpdate bit not null default 0,
	isAdmin bit not null default 0
)
GO


-- Grant domain administrator access.
insert into CR.Users (userName, isActive, canViewAll, canUpdate, isAdmin) values ('administrator', 1, 1, 0, 1)
GO


create table CR.RecordTypes (
	recordTypeKey varchar(20) primary key not null,
	recordType varchar(100) not null,
	minlength tinyint not null default 1 check (minlength > 0 and minlength <= 30),
	maxlength tinyint not null default 30 check (maxlength > 0 and maxlength <= 30),
	pattern varchar(50) not null default '',
	patternHelp varchar(100) not null default '',
	isActive bit not null default 1
)
GO


insert into CR.RecordTypes (recordTypeKey, recordType) values ('agreement', 'Agreement')
insert into CR.RecordTypes (recordTypeKey, recordType) values ('bylaw',     'By-Law')
insert into CR.RecordTypes (recordTypeKey, recordType) values ('deed',      'Deed')
insert into CR.RecordTypes (recordTypeKey, recordType) values ('easement',  'Easement')
GO


create table CR.Records (
	recordID bigint primary key identity not null,
	recordTypeKey varchar(20) not null,
	recordNumber varchar(30) not null,
	recordTitle nvarchar(200),
	recordDescription nvarchar(max),
	party nvarchar(300),
	location nvarchar(300),
	recordDate datetime,

	recordCreate_userName varchar(30) not null,
	recordCreate_datetime datetime not null default getdate(),
	recordUpdate_userName varchar(30) not null,
	recordUpdate_datetime datetime not null default getdate(),
	recordDelete_userName varchar(30),
	recordDelete_datetime datetime,

	constraint fk_records_recordtypekey foreign key (recordTypeKey) references CR.RecordTypes (recordTypeKey)
	on update cascade
	on delete no action
)
GO


create table CR.RelatedRecords (
	recordID_A bigint not null,
	recordID_B bigint not null,

	constraint pk_relatedrecords primary key (recordID_A, recordID_B),
	constraint fk_relatedrecords_recordida foreign key (recordID_A) references CR.Records (recordID)
	on update no action
	on delete no action,
	constraint fk_relatedrecords_recordidb foreign key (recordID_B) references CR.Records (recordID)
	on update no action
	on delete no action,
	constraint ck_relatedrecords check (recordID_A < recordID_B)
)
GO


create table CR.RecordTags (
	recordID bigint not null,
	tag varchar(100) not null,

	constraint pk_recordtags primary key (recordID, tag),
	constraint fk_recordtags_recordid foreign key (recordID) references CR.Records (recordID)
	on update no action
	on delete no action
)
GO


create view CR.RecordTagCSV as
	select t1.recordID,
  	stuff((select ',' + tag
      from CR.RecordTags t2
      where t1.recordID = t2.recordID
      order by tag
      FOR XML PATH(''), TYPE).value('.', 'varchar(max)'),
      1,1,'')
    as tagCSV
    from CR.RecordTags t1
    group by recordID
GO


create table CR.StatusTypes (
	statusTypeKey varchar(30) primary key not null,
	recordTypeKey varchar(20),
	statusType varchar(100),
	orderNumber tinyint not null default 0,
	isActive bit not null default 1,

	constraint fk_statustypes_recordtypekey foreign key (recordTypeKey) references CR.RecordTypes (recordTypeKey)
	on update cascade
	on delete cascade
)
GO


insert into CR.StatusTypes (statusTypeKey, recordTypeKey, statusType, orderNumber, isActive)
values ('bylaw-new', 'bylaw', 'New', 1, 1)

insert into CR.StatusTypes (statusTypeKey, recordTypeKey, statusType, orderNumber, isActive)
values ('bylaw-amending', 'bylaw', 'Amending', 2, 1)

insert into CR.StatusTypes (statusTypeKey, recordTypeKey, statusType, orderNumber, isActive)
values ('bylaw-consolidated', 'bylaw', 'Consolidated', 3, 1)

insert into CR.StatusTypes (statusTypeKey, recordTypeKey, statusType, orderNumber, isActive)
values ('bylaw-repealing', 'bylaw', 'Repealing', 4, 1)

insert into CR.StatusTypes (statusTypeKey, recordTypeKey, statusType, orderNumber, isActive)
values ('bylaw-repealed', 'bylaw', 'Repealed', 5, 1)

GO


create table CR.RecordStatusLog (
	statusLogID bigint primary key not null identity,
	recordID bigint not null,

	statusTime datetime not null default getdate(),
	statusTypeKey varchar(30) not null,
	statusLog nvarchar(max),

	recordCreate_userName varchar(30) not null,
	recordCreate_datetime datetime not null default getdate(),
	recordUpdate_userName varchar(30) not null,
	recordUpdate_datetime datetime not null default getdate(),
	recordDelete_userName varchar(30),
	recordDelete_datetime datetime,

	constraint fk_recordstatuslog_recordid foreign key (recordID) references CR.Records (recordID)
	on update no action
	on delete no action,

	constraint fk_recordstatuslog_statustypekey foreign key (statusTypeKey) references CR.StatusTypes (statusTypeKey)
	on update cascade
	on delete no action
)
GO


create table CR.RecordCommentLog (
	commentLogID bigint primary key not null identity,
	recordID bigint not null,

	commentTime datetime not null default getdate(),
	comment nvarchar(max) not null,

	recordCreate_userName varchar(30) not null,
	recordCreate_datetime datetime not null default getdate(),
	recordUpdate_userName varchar(30) not null,
	recordUpdate_datetime datetime not null default getdate(),
	recordDelete_userName varchar(30),
	recordDelete_datetime datetime,

	constraint fk_recordcommentlog_recordid foreign key (recordID) references CR.Records (recordID)
	on update no action
	on delete no action
)
GO


create table CR.RecordURLs (
	urlID bigint primary key not null identity,
	recordID bigint not null,

	url varchar(500) not null,
	urlTitle nvarchar(200),
	urlDescription nvarchar(max),

	recordCreate_userName varchar(30) not null,
	recordCreate_datetime datetime not null default getdate(),
	recordUpdate_userName varchar(30) not null,
	recordUpdate_datetime datetime not null default getdate(),
	recordDelete_userName varchar(30),
	recordDelete_datetime datetime,

	constraint fk_recordurls_recordid foreign key (recordID) references CR.Records (recordID)
	on update no action
	on delete no action
)
GO


create table CR.RecordUserTypes (
	recordUserTypeKey varchar(30) primary key not null,
	recordUserType varchar(100) not null,
	isActive bit not null default 1
)
GO


insert into CR.RecordUserTypes (recordUserTypeKey, recordUserType, isActive) values ('authority-delegated', 'Delegated Authority', 1)

GO


create table CR.RecordUsers (
	recordUserID bigint primary key identity,

	recordID bigint not null,
	userName varchar(30) not null,
	recordUserTypeKey varchar(30) not null,

	recordCreate_userName varchar(30) not null,
	recordCreate_datetime datetime not null default getdate(),
	recordUpdate_userName varchar(30) not null,
	recordUpdate_datetime datetime not null default getdate(),
	recordDelete_userName varchar(30),
	recordDelete_datetime datetime,

	constraint u_recordusers unique (recordID, userName, recordUserTypeKey),

	constraint fk_recordusers_recordid foreign key (recordID) references CR.Records (recordID)
	on update no action
	on delete no action,

	constraint fk_recordusers_recordusertypekey foreign key (recordUserTypeKey) references CR.RecordUserTypes (recordUserTypeKey)
	on update no action
	on delete no action
)
GO
