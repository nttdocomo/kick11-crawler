#从transfermarkt_team表中选出id等于owner_id（这就说明队伍本身就是一个俱乐部的一队，在这里我就当作是一个俱乐部了），并且type=2（说明是一个俱乐部队伍），还有就是他的id没有在transfermarkt_club表里出现
INSERT INTO `transfermarket_club`(`id`,`club_name`,`profile_uri`,`nation_id`) SELECT id, team_name, profile_uri, nation_id FROM `transfermarket_team` WHERE id = owner_id AND type = 2 AND id NOT IN (SELECT `id` FROM `transfermarket_club`)

#如果transfermarkt_club的nation_id为空
UPDATE `transfermarkt_club` JOIN `transfermarkt_team` ON transfermarkt_club.id = transfermarkt_team.id SET transfermarkt_club.nation_id = transfermarkt_team.nation_id

#将transfermarkt_club里的的记录复制到club表中
INSERT INTO `club`(`name`,`nation_id`) SELECT transfermarket_club.club_name,transfermarket_nation.nation_ref_id FROM `transfermarket_club` JOIN `transfermarket_nation` ON transfermarket_club.nation_id = transfermarket_nation.id WHERE `club_name` NOT IN (SELECT `name` FROM `club`)

#将club.id复制到将transfermarkt_club的club_ref_id中
UPDATE `transfermarket_club` JOIN `club` ON transfermarket_club.club_name = club.name SET transfermarket_club.club_ref_id = club.id WHERE transfermarket_club.club_ref_id = 0



DELETE FROM club
WHERE name IN (SELECT name FROM club GROUP BY name HAVING COUNT(name) > 1)
AND id NOT IN (SELECT min(id) FROM club GROUP BY name HAVING COUNT(name)>1)

delete a.* from club a,tmp_ids b where b.name=a.name and a.id>b.id;
truncate table tmp_ids;